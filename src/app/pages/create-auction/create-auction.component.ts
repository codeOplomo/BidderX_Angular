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
import { ProductVM } from '../../models/view-models/product-vm';

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
  products: ProductVM[] = [];
  productFiles: File[] = [];
  productImages: { file: File | null, preview: string | null }[] = [{ file: null, preview: null }];

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionsService,
    private productService: ProductsService,
    private toastService: ToastService,
    private router: Router,
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
      isInstantAuction: [false],
      auctionDurationInHours: [null],
      createNewProduct: [false],
      existingProductId: [null],
      collectionId: [null],
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

    const formValue = this.auctionForm.getRawValue();
    console.log('createNewProduct value:', formValue.createNewProduct);
    // Check if form is valid before proceeding
    if (this.auctionForm.invalid) {
        this.markFormGroupTouched(this.auctionForm);
        this.logInvalidControls();
        return;
    }
    
    if (formValue.createNewProduct) {
      console.log('productFiles:', this.productFiles); // Debugging log
      const hasMainImage = this.productFiles.length > 0 && this.productFiles[0] != null;
      if (!hasMainImage) {
        this.toastService.showError('Main Image Required', 'Please upload a main image for the product.');
        this.isSubmitting = false;
        return;
      }
    } else {
      // Check existingProductId using formValue
      if (!formValue.existingProductId) {
        this.toastService.showError('Product Required', 'Please select an existing product or create a new one.');
        this.isSubmitting = false;
        return;
      }
    }
  
    this.isSubmitting = true;
    const formData = new FormData();

    // Create the base auction data
    let vm: CreateAuctionVM = {
        title: formValue.title,
        description: formValue.description,
        startingPrice: BigInt(formValue.startingPrice).toString(),
        isInstantAuction: formValue.isInstantAuction,
        auctionDurationInHours: formValue.isInstantAuction ? null : formValue.auctionDurationInHours
    };

    // Add product-specific fields based on whether we're creating a new product
    if (formValue.createNewProduct) {
        vm = {
            ...vm,
            productTitle: formValue.productTitle,
            productDescription: formValue.productDescription,
            condition: formValue.condition,
            manufacturer: formValue.manufacturer,
            productionDate: formValue.productionDate ? 
                new Date(formValue.productionDate).toISOString() : undefined,
            categoryId: formValue.category,
            collectionId: formValue.collectionId
        };
    } else {
        vm.existingProductId = formValue.existingProductId;
    }
    
    formData.append('vm', new Blob([JSON.stringify(vm)], { type: 'application/json' }));

    if (formValue.createNewProduct) {
        // Filter out any null files and ensure we have at least one valid file
        const filteredFiles = this.productFiles.filter(file => file !== null && file !== undefined);
        
        if (filteredFiles.length > 0) {
            // Append the first file as mainImage
            formData.append('mainImage', filteredFiles[0], filteredFiles[0].name);
            
            // Append any additional files (if they exist)
            filteredFiles.slice(1).forEach((file, index) => {
                formData.append('additionalImages', file, file.name);
            });
        }
    }
    console.log('FormData entries:');
    for (const entry of (formData as any).entries()) {
      console.log(entry[0], entry[1]);
    }
    try {
        const response = await lastValueFrom(
            this.auctionService.createAuction(formData)
        );
        this.toastService.showSuccess(
            'Auction Created', 
            'Your auction was created successfully!'
        );

        const productId = response.data.product.id;
        this.router.navigate(['/product-detail', productId]);
    } catch (error) {
        console.error('Auction creation error:', error);
        this.toastService.showError(
            'Creation Failed', 
            'There was an error creating your auction. Please try again.'
        );
    } finally {
        this.isSubmitting = false;
    }
}

private loadProducts(): void {
  this.productService.getAvailableUserProductsByEmail(this.userEmail).subscribe({
    next: (response) => {
      this.products = response.data.content.filter(product => !product.auctionId);
      
      if (this.products.length === 0) {
        this.auctionForm.get('createNewProduct')?.setValue(true);
        this.auctionForm.get('createNewProduct')?.disable();
        this.showNewProductFields = true;
        this.updateValidators();
        this.auctionForm.updateValueAndValidity(); // <-- Force validation update
      }
    },
    error: (err) => {
      this.products = [];
      this.auctionForm.get('createNewProduct')?.setValue(true);
      this.auctionForm.get('createNewProduct')?.disable();
      this.showNewProductFields = true;
      this.updateValidators();
      this.auctionForm.updateValueAndValidity(); // <-- Force validation update
    }
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
  
    // Update productFiles
    if (index >= this.productFiles.length) {
      this.productFiles.push(file);
    } else {
      this.productFiles[index] = file;
    }
  
    // Update productImages for preview
    const reader = new FileReader();
    reader.onload = () => {
      this.productImages[index] = { file, preview: reader.result as string };
      // Add new empty slot only if this is the last image
      if (index === this.productImages.length - 1) {
        this.productImages.push({ file: null, preview: null });
      }
      this.auctionForm.markAsDirty(); // Ensure form detects changes
    };
    reader.readAsDataURL(file);
  }
  
  removeImage(index: number): void {
    // Remove the image and shift remaining files
    this.productImages.splice(index, 1);
    this.productFiles.splice(index, 1);
    
    // Add empty slot if last image was removed
    if (this.productImages.length === 0) {
      this.productImages.push({ file: null, preview: null });
    }
  }

  private updateValidators(): void {
    const createNewProduct = this.auctionForm.get('createNewProduct')?.value;
    const isInstantAuction = this.auctionForm.get('isInstantAuction')?.value;
  
    // Reset validators
    Object.keys(this.auctionForm.controls)
      .filter(key => key !== 'createNewProduct' && key !== 'isInstantAuction')
      .forEach(key => {
        this.auctionForm.get(key)?.clearValidators();
      });
  
    // Common required fields
    this.auctionForm.get('title')?.setValidators([Validators.required, Validators.maxLength(100)]);
    this.auctionForm.get('description')?.setValidators([Validators.required, Validators.maxLength(500)]);
    this.auctionForm.get('startingPrice')?.setValidators([Validators.required, Validators.min(0)]);
  
    // Product-specific validators
    if (createNewProduct) {
      this.auctionForm.get('productTitle')?.setValidators([Validators.required]);
      this.auctionForm.get('productDescription')?.setValidators([Validators.required]);
      this.auctionForm.get('category')?.setValidators([Validators.required]);
      this.auctionForm.get('condition')?.setValidators([Validators.required]);
      this.auctionForm.get('manufacturer')?.setValidators([Validators.required]);
      this.auctionForm.get('productionDate')?.setValidators([Validators.required]);
      
      // Clear existing product selection
      this.auctionForm.get('existingProductId')?.clearValidators();
      this.auctionForm.get('existingProductId')?.setValue(null);
    } else {
      // Require existing product selection when not creating new
      this.auctionForm.get('existingProductId')?.setValidators([Validators.required]);
      
      // Clear new product fields
      ['productTitle', 'productDescription', 'category', 'condition', 
       'manufacturer', 'productionDate'].forEach(field => {
        this.auctionForm.get(field)?.setValue(null);
      });
    }
  
    // Duration validators based on auction type
    if (isInstantAuction) {
      this.auctionForm.get('auctionDurationInHours')?.clearValidators();
      this.auctionForm.get('auctionDurationInHours')?.setValue(null);
      this.auctionForm.get('auctionDurationInHours')?.disable();
    } else {
      this.auctionForm.get('auctionDurationInHours')?.enable();
      this.auctionForm.get('auctionDurationInHours')?.setValidators([Validators.required]);
    }
  
    // Update validity state
    Object.keys(this.auctionForm.controls).forEach(key => {
      this.auctionForm.get(key)?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logInvalidControls(): void {
    const invalidControls: string[] = []; 
    Object.keys(this.auctionForm.controls).forEach(key => {
      const control = this.auctionForm.get(key);
      if (control?.invalid) {
        invalidControls.push(key);
      }
    });
    console.log('Invalid controls:', invalidControls);
  }
}