import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user/user.actions';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImagesService } from '../../services/images.service';
import { WalletVM } from '../../models/view-models/wallet-vm';
import { WalletService } from '../../services/wallet.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileVM } from '../../models/view-models/profile';
import { DepositDialogComponent } from '../deposit-dialog/deposit-dialog.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [SplitButtonModule, TagModule, RatingModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent implements OnDestroy {
  @Input() user$?: Observable<ProfileVM>;
  @Input() rating?: number;
  @Input() imageLoading?: boolean;
  @Input() coverImageLoading = false;
  private destroy$ = new Subject<void>();
  wallet$!: Observable<WalletVM>;

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
    private authService: AuthService,
    private walletService: WalletService, 
    private dialog: MatDialog,
    private store: Store, 
    private router: Router
  ) {}

  loadWallet() {
    this.wallet$ = this.walletService.getWallet();
  }

  openDepositDialog(): void {
    const dialogRef = this.dialog.open(DepositDialogComponent, {
      width: '400px',
      data: { currentBalance: this.wallet$ ? (this.wallet$ as any).balance : 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.walletService.depositFunds(result.amount).subscribe({
          next: () => {
            this.loadWallet(); // Refresh wallet data
            // Show success notification
          },
          error: (err) => {
            // Handle error
          }
        });
      }
    });
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
  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
