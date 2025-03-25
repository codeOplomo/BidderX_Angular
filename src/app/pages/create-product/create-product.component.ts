import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormComponent } from "../../components/product-form/product-form.component";
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProductVM } from '../../models/view-models/product-vm';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ProductFormComponent, ToastModule, CardModule, CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  productForm!: FormGroup;
  collectionId?: string;
  productFiles: File[] = [];
  productImages: { file: File | null, preview: string | null }[] = [{ file: null, preview: null }];
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private productsService: ProductsService, private router: Router) {
    this.initializeForm();
    this.route.queryParams.subscribe(params => {
      this.collectionId = params['collectionId'];
    });
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      productTitle: ['', Validators.required],
      manufacturer: ['', Validators.required],
      condition: ['', Validators.required],
      productionDate: ['', Validators.required],
      category: ['', Validators.required],
      productDescription: ['', Validators.required],
      collectionId: ['']
    });
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting || !this.productForm.valid) return;
    this.isSubmitting = true;
  
    const formData = new FormData();
    const product: ProductVM = {
      title: this.productForm.get('productTitle')?.value,
      manufacturer: this.productForm.get('manufacturer')?.value,
      condition: this.productForm.get('condition')?.value,
      productionDate: this.productForm.get('productionDate')?.value,
      categoryId: this.productForm.get('category')?.value,
      description: this.productForm.get('productDescription')?.value,
      collectionId: this.productForm.get('collectionId')?.value,
    }
  
    formData.append('product', new Blob([JSON.stringify(product)], { 
      type: 'application/json' 
    }));
  
    this.productFiles
  .filter((file) => file !== null)
  .forEach((file, index) => {
    formData.append(index === 0 ? 'mainImage' : 'additionalImages', file);
  });
  
    try {
      console.log('Submitting form:', this.productForm.value);
      await this.productsService.createProduct(formData).toPromise();
      console.log('Form submitted successfully:', this.productForm.value);
      this.productForm.reset();
      this.productImages = [{ file: null, preview: null }];
      this.productFiles = [];
      this.router.navigate(['/profile']);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Error creating product. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
  }

  onUpdateProductImage(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.productImages[index] = { file, preview: reader.result as string };

      this.productFiles[index] = file;

      if (index === this.productImages.length - 1) {
        this.productImages.push({ file: null, preview: null });
        this.productFiles.push(null as any); 
      }
    };
    reader.readAsDataURL(file);
  }
}
