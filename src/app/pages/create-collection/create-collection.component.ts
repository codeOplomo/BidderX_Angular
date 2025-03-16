import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionsService } from '../../services/collections.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [ButtonModule, CommonModule, CardModule, FormsModule, ReactiveFormsModule, ToastModule],
  templateUrl: './create-collection.component.html',
  styleUrl: './create-collection.component.css',
  providers: [ToastService]
})
export class CreateCollectionComponent implements OnInit {
  collectionForm!: FormGroup;
  errorMessage: string = '';
  coverPreview: string | null = null;
  coverFile: File | null = null;
  isSubmitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private collectionsService: CollectionsService,
    private imagesService: ImagesService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      isExplicit: [false]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  
  onSubmit(): void {
    if (this.collectionForm.valid) {
      this.isSubmitting = true;
      const formData = this.collectionForm.value;
      
      // First create the collection without image
      this.collectionsService.createCollection(formData).subscribe(
        (response) => {
          const collectionId = response.data.id;
          
          // If there's a cover image, upload it
          if (this.coverFile) {
            this.uploadCoverImage(collectionId);
          } else {
            // No cover image to upload, navigate directly
            this.handleSuccess(collectionId);
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }
  
  private uploadCoverImage(collectionId: string): void {
    // Use the mocked image selection process since uploadShowcaseCoverImage uses a dialog
    // We already have the file, so we'll need to patch the method slightly
    
    // Create a modified wrapper around uploadShowcaseCoverImage that uses our existing file
    this.handleExistingFileUpload(collectionId);
  }

  private handleExistingFileUpload(collectionId: string): void {
    if (!this.coverFile) return;
    
    // Directly call the uploadImage method from ImagesService
    // (Make sure ImagesService is injected in your component if you take this approach)
    this.imagesService.uploadImage(this.coverFile, 'collection-cover', collectionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ imageUrl }: { imageUrl: string }) => {
          // Image uploaded successfully – proceed
          this.handleSuccess(collectionId);
        },
        error: (error: any) => {
          this.toastService.showError(
            'Partial Success', 
            'Collection created but cover image upload failed. You can add it later.'
          );
          this.handleSuccess(collectionId);
        }
      });
  }
  

  private handleSuccess(collectionId: string): void {
    this.isSubmitting = false;
    this.toastService.showSuccess('Success', 'Collection created successfully!');
    this.router.navigate(['/collection-showcase', collectionId]);
  }
  
  private handleError(error: any): void {
    this.isSubmitting = false;
    console.error('Error creating collection:', error);
    this.toastService.showError('Error', 'Failed to create collection. Please try again.');
  }
  
  onCoverImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.coverFile = file;
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}
