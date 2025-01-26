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
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { ProductVm } from '../../models/view-models/product-vm.model';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule, CardModule, CommonModule],
  templateUrl: './create-auction.component.html',
  styleUrl: './create-auction.component.css'
})
export class CreateAuctionComponent {
  userEmail: string = '';
  user$: Observable<any>;
  auctionForm!: FormGroup;
  productPreview: string | null = null;
  showNewProductFields = false;
  isSubmitting = false;

  products: ProductVm[] = [];
  
  categories = ['Electronics', 'Furniture', 'Clothing', 'Books'];

  constructor(
    private fb: FormBuilder, 
    private auctionService: AuctionsService, 
    private categoryService: CategoriesService,
    private productService: ProductsService,
    private router: Router,
    private store: Store
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.user$.subscribe(user =>{ 
      console.log('User data in ProfileComponent:', user);
      if (user) {
        this.userEmail = user.email; 
        this.loadProducts(); 
      }
      });
  }

  private initializeForm(): void {
    this.auctionForm = this.fb.group({
      // Auction fields
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startingPrice: ['', [Validators.required, Validators.min(0)]],
      startTime: ['', [Validators.required]],
      
      // Product selection
      createNewProduct: [false],
      existingProductId: [null],
      category: [null],

      // New product fields
      productTitle: [null],
      productDescription: [null],
      condition: [null],
      manufacturer: [null],
      productionDate: [null],
      productImageUrl: [null]
    });

    // Dynamic validator management
    this.auctionForm.get('createNewProduct')?.valueChanges.subscribe(createNew => {
      this.updateValidators(createNew);
      this.showNewProductFields = createNew;
    });
  }

  loadProducts() {
    if (!this.userEmail) return;
    this.productService.getAvailableUserProductsByEmail(this.userEmail).subscribe({
      next: (response) => {
        this.products = response.data; // Set the collections array
        console.log('Fetched products:', this.products); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching products by user ID:', err);
      },
    });
  }
  

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Failed to load categories', err)
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
      isInstantAuction: false, // You might want to add this to form
      auctionDurationInHours: 48, // Default or from form
      ...(formValue.createNewProduct ? {
        productTitle: formValue.productTitle,
        productDescription: formValue.productDescription,
        condition: formValue.condition,
        manufacturer: formValue.manufacturer,
        productionDate: new Date(formValue.productionDate).toISOString(), 
        productImageUrl: this.productPreview || "",
        categoryId: formValue.category
      } : {
        existingProductId: formValue.existingProductId
      })
    };

    try {
      const response = await this.auctionService.createAuction(request).toPromise();
      if (response && response.data && response.data.id) {
        this.router.navigate(['/auctions', response.data.id]);
      } else {
        console.error('Unexpected response structure:', response);
        // Handle unexpected response
      }
    } catch (error) {
      console.error('Auction creation failed', error);
      // Handle error (e.g., show a toast message)
    } finally {
      this.isSubmitting = false;
    }
    
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private updateValidators(createNew: boolean): void {
    const productFields = [
      'productTitle', 'productDescription', 'condition', 
      'manufacturer', 'productionDate', 'category'
    ];
    
    if (createNew) {
      productFields.forEach(field => {
        this.auctionForm.get(field)?.setValidators([Validators.required]);
      });
      this.auctionForm.get('existingProductId')?.clearValidators();
    } else {
      productFields.forEach(field => {
        this.auctionForm.get(field)?.clearValidators();
      });
      this.auctionForm.get('existingProductId')?.setValidators([Validators.required]);
    }
    
    this.auctionForm.updateValueAndValidity();
  }

  onCreateNewProductToggle(): void {
    this.showNewProductFields = this.auctionForm.get('createNewProduct')?.value;
    if (!this.showNewProductFields) {
      this.productPreview = null;
    }
  }

  onProductImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


}
