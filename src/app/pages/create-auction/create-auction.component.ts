import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AuctionsService } from '../../services/auctions.service';
import { CreateAuctionVM } from '../../models/view-models/create-auction-vm.model';
import { ProductsService } from '../../services/products.service';
import { distinctUntilChanged, lastValueFrom, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { ProductVm } from '../../models/view-models/product-vm.model';
import { ProductFormComponent } from "../../components/product-form/product-form.component";

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule, CardModule, CommonModule, ProductFormComponent],
  templateUrl: './create-auction.component.html',
  styleUrl: './create-auction.component.css',
  providers: [ToastService]
})
export class CreateAuctionComponent {
  userEmail: string = '';
  user$: Observable<any>;
  private destroy$ = new Subject<void>();
  auctionForm!: FormGroup;
  showNewProductFields = false;
  isSubmitting = false;
  products: ProductVm[] = [];
  productFiles: File[] = [];
  productImages: { file: File | null, preview: string | null }[] = [{ file: null, preview: null }];



  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionsService,
    private productService: ProductsService,
    private store: Store,
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.initializeForm();

    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.loadProducts();
      }
    });
  }

  private initializeForm(): void {
    this.auctionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startingPrice: ['', [Validators.required, Validators.min(0)]],
      startTime: ['', [Validators.required]],
      isInstantAuction: [false],
      auctionDurationInHours: [null],
      createNewProduct: [false],
      existingProductId: [null],
      category: [null],
      productTitle: [null],
      productDescription: [null],
      condition: [null],
      manufacturer: [null],
      productionDate: [null],
      productImages: [[]],
    });

    this.auctionForm.get('createNewProduct')?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(createNew => {
        this.showNewProductFields = createNew;
        this.updateValidators();
      });


    this.auctionForm.get('isInstantAuction')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateValidators());
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting || this.auctionForm.invalid) return;
    this.isSubmitting = true;

    // Prepare FormData
    const formData = new FormData();

    // 1. Append the CreateAuctionVM as a JSON blob
    const vm: CreateAuctionVM = {
      title: this.auctionForm.value.title,
      description: this.auctionForm.value.description,
      startTime: new Date(this.auctionForm.value.startTime).toISOString(),
      startingPrice: BigInt(this.auctionForm.value.startingPrice).toString(),
      isInstantAuction: this.auctionForm.value.isInstantAuction,
      auctionDurationInHours: this.auctionForm.value.auctionDurationInHours || 0,
      ...(this.auctionForm.value.createNewProduct ? {
        productTitle: this.auctionForm.value.productTitle,
        productDescription: this.auctionForm.value.productDescription,
        condition: this.auctionForm.value.condition,
        manufacturer: this.auctionForm.value.manufacturer,
        productionDate: new Date(this.auctionForm.value.productionDate).toISOString(),
        categoryId: this.auctionForm.value.category
      } : { existingProductId: this.auctionForm.value.existingProductId })
    };
    

    formData.append('vm', new Blob([JSON.stringify(vm)], { type: 'application/json' }));

    // 2. Append images (only for new products)
    if (this.auctionForm.value.createNewProduct) {
      this.productFiles.forEach((file, index) => {
        formData.append(index === 0 ? 'mainImage' : 'additionalImages', file);
      });
    }

    // 3. Send request
    try {
      const response = await lastValueFrom(
        this.auctionService.createAuction(formData)
      );
      // Handle success...
    } catch (error) {
      // Handle error...
    } finally {
      this.isSubmitting = false;
    }
  }

  private loadProducts(): void {
    if (!this.userEmail) return;
    this.productService.getAvailableUserProductsByEmail(this.userEmail)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.products = response.data;
          if (this.products.length === 0) {
            this.auctionForm.get('createNewProduct')?.setValue(true);
            this.showNewProductFields = true;
            this.updateValidators();
          }
        },
        error: (err) => console.error('Error fetching products:', err),
      });
  }


  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) this.markFormGroupTouched(control);
    });
  }

  onUpdateProductImage(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Update productImages for preview
      this.productImages[index] = { file, preview: reader.result as string };

      // Also update productFiles so the file can be appended to the form data
      this.productFiles[index] = file;

      // If it's the last placeholder, add a new empty slot
      if (index === this.productImages.length - 1) {
        this.productImages.push({ file: null, preview: null });
        this.productFiles.push(null as any); // or simply leave it unpushed if not needed
      }
    };
    reader.readAsDataURL(file);
  }


  private updateValidators(): void {
    const createNewProduct = this.auctionForm.get('createNewProduct')?.value;
    const isInstantAuction = this.auctionForm.get('isInstantAuction')?.value;
  
    // Reset validators on controls that need dynamic validators
    Object.keys(this.auctionForm.controls)
      .filter(key => key !== 'createNewProduct' && key !== 'isInstantAuction')
      .forEach(key => {
        this.auctionForm.get(key)?.clearValidators();
      });
  
    // Always set validators for common fields
    this.auctionForm.get('title')?.setValidators([Validators.required, Validators.maxLength(100)]);
    this.auctionForm.get('description')?.setValidators([Validators.required, Validators.maxLength(500)]);
    this.auctionForm.get('startingPrice')?.setValidators([Validators.required, Validators.min(0)]);
  
    // For non-instant auctions, require a start time
    // (You might still want a startTime even for instant auctions, so adjust this as needed.)
    if (!isInstantAuction) {
      this.auctionForm.get('startTime')?.setValidators([Validators.required]);
    } else {
      // Optionally, if you want to auto-set the start time or leave it optional, you can clear its validators.
      this.auctionForm.get('startTime')?.clearValidators();
    }
  
    if (createNewProduct) {
      // New product validators
      this.auctionForm.get('productTitle')?.setValidators([Validators.required]);
      this.auctionForm.get('productDescription')?.setValidators([Validators.required]);
      this.auctionForm.get('category')?.setValidators([Validators.required]);
      this.auctionForm.get('condition')?.setValidators([Validators.required]);
      this.auctionForm.get('manufacturer')?.setValidators([Validators.required]);
      this.auctionForm.get('productionDate')?.setValidators([Validators.required]);
    } else {
      // Existing product validator
      this.auctionForm.get('existingProductId')?.setValidators([Validators.required]);
    }
  
    // Handle auction duration based on instant auction selection
    if (isInstantAuction) {
      // Disable auction duration since it's not needed
      this.auctionForm.get('auctionDurationInHours')?.clearValidators();
      this.auctionForm.get('auctionDurationInHours')?.setValue(null);
      this.auctionForm.get('auctionDurationInHours')?.disable();
    } else {
      // Enable auction duration and add a required validator if needed
      this.auctionForm.get('auctionDurationInHours')?.enable();
      this.auctionForm.get('auctionDurationInHours')?.setValidators([Validators.required]);
    }
  
    // Update validity for all controls
    Object.keys(this.auctionForm.controls).forEach(key => {
      this.auctionForm.get(key)?.updateValueAndValidity();
    });
  }
  

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // Helper method to log all invalid controls for debugging
  logInvalidControls(): void {
    const invalidControls: string[] = []; // Explicitly declare as string array
    Object.keys(this.auctionForm.controls).forEach(key => {
      const control = this.auctionForm.get(key);
      if (control?.invalid) {
        invalidControls.push(key);
      }
    });
    console.log('Invalid controls:', invalidControls);
  }
}
