import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AuctionsService } from '../../services/auctions.service';
import { CreateAuctionVm } from '../../models/view-models/create-auction-vm.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { lastValueFrom, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { ProductVm } from '../../models/view-models/product-vm.model';
import { Category } from '../../models/view-models/category.model';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule, CardModule, CommonModule],
  templateUrl: './create-auction.component.html',
  styleUrl: './create-auction.component.css',
  providers: [ToastService]
})
export class CreateAuctionComponent {
  userEmail: string = '';
  user$: Observable<any>;
  private destroy$ = new Subject<void>();
  auctionForm!: FormGroup;
  productPreview: string | null = null;
  showNewProductFields = false;
  isSubmitting = false;
  isUploadingImage = false;
  products: ProductVm[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionsService,
    private categoryService: CategoriesService,
    private productService: ProductsService,
    private router: Router,
    private store: Store,
    private toastService: ToastService,
    private imagesService: ImagesService
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  
    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => { 
      console.log('User data:', user);
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
      createNewProduct: [false],
      existingProductId: [null],
      category: [null, Validators.required],
      productTitle: [null],
      productDescription: [null],
      condition: [null],
      manufacturer: [null],
      productionDate: [null],
      productImageUrl: [null]
    });

    this.auctionForm.get('createNewProduct')?.valueChanges
      .pipe(tap(this.updateValidators.bind(this)))
      .subscribe();
  }

  private loadProducts(): void {
    if (!this.userEmail) return;
    this.productService.getAvailableUserProductsByEmail(this.userEmail)
      .pipe(take(1))
      .subscribe({
        next: (response) => this.products = response.data,
        error: (err) => console.error('Error fetching products:', err),
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(take(1))
      .subscribe({
        next: (response) => this.categories = response.data,
        error: (err) => console.error('Failed to load categories', err),
      });
  }

  async onSubmit(): Promise<void> {
    if (this.auctionForm.invalid) {
      this.markFormGroupTouched(this.auctionForm);
      return;
    }
  
    this.isSubmitting = true;
    const formValue = this.auctionForm.value;
  
    const request: CreateAuctionVm = {
      title: formValue.title,
      description: formValue.description,
      startTime: new Date(formValue.startTime).toISOString(),
      startingPrice: BigInt(formValue.startingPrice).toString(),
      isInstantAuction: false,
      auctionDurationInHours: 48,
      ...(formValue.createNewProduct
        ? {
            productTitle: formValue.productTitle,
            productDescription: formValue.productDescription,
            condition: formValue.condition,
            manufacturer: formValue.manufacturer,
            productionDate: new Date(formValue.productionDate).toISOString(),
            productImageUrl: this.productPreview || "",
            categoryId: formValue.category
          }
        : { existingProductId: formValue.existingProductId })
    };
  
    try {
      const response = await lastValueFrom(this.auctionService.createAuction(request));
      if (response?.data?.id) {
        this.toastService.showSuccess('Success', 'Auction created successfully!');
        this.router.navigate(['/auctions', response.data.id]);
      }
    } catch (error) {
      console.error('Auction creation failed', error);
      this.toastService.showError('Error', 'Failed to create auction. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) this.markFormGroupTouched(control);
    });
  }

  private updateValidators(createNew: boolean): void {
    const productFields = [
      'productTitle', 'productDescription', 'condition',
      'manufacturer', 'productionDate', 'category'
    ];
  
    productFields.forEach(field => {
      const control = this.auctionForm.get(field);
      if (control) {
        control.setValidators(createNew ? [Validators.required] : null);
        control.updateValueAndValidity();
        if (!createNew) {
          control.setValue(null);
        }
      }
    });
  
    const existingProductControl = this.auctionForm.get('existingProductId');
    if (existingProductControl) {
      existingProductControl.setValidators(createNew ? null : [Validators.required]);
      existingProductControl.updateValueAndValidity();
      if (createNew) {
        existingProductControl.setValue(null);
      }
    }
  }

  onCreateNewProductToggle(): void {
    this.showNewProductFields = this.auctionForm.get('createNewProduct')?.value;
    if (!this.showNewProductFields) this.productPreview = null;
  }

  onUpdateProductImage(event: Event): void {
    event.stopPropagation(); // Stop event propagation
  
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
  
    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      this.productPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  
    // Handle upload through ProductService
    this.productService.uploadProductImage(
      this.destroy$,
      (imageUrl) => {
        console.log('Product image updated:', imageUrl);
        this.productPreview = imageUrl; // Update preview with server URL
        this.auctionForm.patchValue({ productImageUrl: imageUrl });
        this.toastService.showSuccess('Success', 'Product image uploaded successfully');
      },
      (loading) => {
        this.isUploadingImage = loading;
        if (loading) {
          console.log('Uploading product image...');
        }
      }
    );
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
