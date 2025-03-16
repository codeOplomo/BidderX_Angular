import { Component, Input, OnDestroy } from '@angular/core';
import { catchError, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImagesService } from '../../services/images.service';
import { WalletVM } from '../../models/view-models/wallet-vm'; 
import { ProfileVM } from '../../models/view-models/profile';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConnectWalletRequest } from '../../models/view-models/connect-wallet-request';
import { DepositRequest } from '../../models/view-models/deposit-request';
import { InputNumberModule } from 'primeng/inputnumber';
import { ApiResponse } from '../../models/view-models/api-response.model';
import * as WalletActions from '../../store/wallet/wallet.actions';
import { selectIsOwner } from '../../store/auth/auth.selectors';
import { ToastService } from '../../services/toast.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [SplitButtonModule, TagModule, RatingModule, CommonModule, FormsModule, ButtonModule, MatProgressSpinnerModule, DialogModule, DropdownModule, InputNumberModule, ToastModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
  providers: [ToastService]
})
export class ProfileHeaderComponent implements OnDestroy {
  @Input() profile$?: Observable<ProfileVM | null>;
  @Input() isCurrentUser: boolean = false;
  @Input() rating?: number;
  @Input() imageLoading?: boolean;
  @Input() coverImageLoading = false;
  private destroy$ = new Subject<void>();
  isOwner$: Observable<boolean>;
  
  wallet$!: Observable<WalletVM>;
  walletLoading = false;
  hasWallet = false;
  showDepositDialog = false;
  showConnectWalletDialog = false;
  depositAmount = 0;
  walletAddress = '';
  isFiatWallet = true;
  currencyCode = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    // add more fiat currencies as needed
  ];
  selectedCurrency = 'USD'; 


  editItems: any[] = [
    {
      label: 'Edit Profile',
      icon: 'pi pi-pencil',
      command: () => this.onEditProfile()
    },
    {
      label: 'Edit Password',
      icon: 'pi pi-lock',
      command: () => this.onEditPassword()
    }
  ];

  constructor(
    private imageService: ImagesService, 
    private userService: UserService, 
    private toastService: ToastService,
    private store: Store, 
    private router: Router
  ) {
    this.isOwner$ = this.store.select(selectIsOwner);
  }

  ngOnInit() {
    
  }

  onBecomeOwner(): void {
    // Optionally, you can add a confirmation dialog here
    this.userService.requestOwnerUpgrade().subscribe({
      next: (response) => {
        // Display a success toast using the returned message
        this.toastService.showSuccess('Request Submitted', response.message);
        // Optionally, refresh the profile observable here to reflect changes
      },
      error: (err) => {
        console.error("Error while submitting owner upgrade request:", err);
        this.toastService.showError('Request Failed', 'Unable to submit owner upgrade request.');
      }
    });
  }
  
  handleWalletAction(hasWallet: boolean) {
    if (hasWallet) {
      this.openDepositDialog();
    } else {
      this.showConnectWalletDialog = true;
    }
  }
  connectWallet(): void {
    if (this.selectedCurrency && this.depositAmount > 0) {
      const request: ConnectWalletRequest = {
        type: 'FIAT',
        currencyCode: this.selectedCurrency,
        depositAmount: this.depositAmount
      };
      this.store.dispatch(WalletActions.connectWallet({ request }));
    }
  }
  
  confirmDeposit(): void {
    if (this.depositAmount > 0) {
      const request: DepositRequest = { amount: this.depositAmount };
      this.store.dispatch(WalletActions.depositFunds({ request }));
    }
  }
  

  openDepositDialog(): void {
    this.showDepositDialog = true;
  }

  
  private handlePaymentRedirect(response: ApiResponse<WalletVM>) {
    if (response.data.checkoutUrl) {
      window.location.href = response.data.checkoutUrl;
    }
    this.showConnectWalletDialog = false;
    this.showDepositDialog = false;
  }
  private showSuccessNotification(message: string): void {
    // Implement your notification logic
  }

  getImageUrl(imagePath: string): string {
    return this.imageService.getImageUrl(imagePath);
  }

  onUpdateProfilePicture(): void {
    this.userService.uploadProfileImage(
      this.destroy$,
      (imageUrl) => {
        console.log('Profile image updated:', imageUrl);
        // You can update the profile image in the UI or emit an event here
      },
      (loading) => {
        this.imageLoading = loading;
        console.log('Profile image loading:', loading);
      }
    );
  }

  onUpdateCoverPicture(): void {
    this.userService.uploadCoverImage(
      this.destroy$,
      (imageUrl) => {
        console.log('Cover image updated:', imageUrl);
        // You can update the cover image in the UI or emit an event here
      },
      (loading) => {
        this.coverImageLoading = loading;
        console.log('Cover image loading:', loading);
      }
    );
  }

    onEditProfile() {
      this.router.navigate(['/edit-profile']);
    }
  
    onEditPassword() {
      this.router.navigate(['/edit-password']);
    }
  
    onCreateCollection() {
      this.router.navigate(['/create-collection']);
    }
  
    onCreateAuction() {
      this.router.navigate(['/create-auction']);
    }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

  // loadWallet() {
  //   this.walletLoading = true;
  //   this.wallet$ = this.walletService.getWallet().pipe(
  //     map((response: ApiResponse<WalletVM>) => response.data),
  //     tap(() => {
  //       this.hasWallet = true;
  //       this.walletLoading = false;
  //     }),
  //     catchError(error => {
  //       this.walletLoading = false;
  //       if (error.status === 404) {
  //         this.hasWallet = false;
  //       }
  //       return of({ balance: 0 } as WalletVM);
  //     })
  //   );
  // }
  
