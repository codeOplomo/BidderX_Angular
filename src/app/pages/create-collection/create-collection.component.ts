import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionsService } from '../../services/collections.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../services/toast.service';

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

  constructor(
    private fb: FormBuilder,
    private collectionsService: CollectionsService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.collectionForm.valid) {
      const formData = this.collectionForm.value;
  
      this.collectionsService.createCollection(formData).subscribe(
        (response) => {
          console.log('Collection created:', response);
          this.toastService.showSuccess('Success', 'Collection created successfully!');
          this.router.navigate(['/collection-showcase', response.data.id]);
        },
        (error) => {
          console.error('Error creating collection:', error);
          this.toastService.showError('Error', 'Failed to create collection. Please try again.');
        }
      );
    }
  }
  
  onCoverImageSelected(event: any) {
    // Similar to logo image handling
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}
