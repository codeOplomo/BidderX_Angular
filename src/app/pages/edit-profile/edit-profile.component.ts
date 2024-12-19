import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { CommonModule, NgIf } from '@angular/common';
import { Toast } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProfileUpdateVM } from '../../models/view-models/profile-update.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule, 
    NgIf, 
    ReactiveFormsModule, 
    Toast, 
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
  providers: [ToastService]
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public router: Router,
    private toastService: ToastService
  ) {
    this.editProfileForm = this.fb.group({
      profileIdentifier: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.pattern('^\\+?[0-9]*$')]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.editProfileForm.patchValue(profile);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile data.';
        this.toastService.showError('Error', this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      this.isLoading = true;
      const profileUpdateVM: ProfileUpdateVM = {
        profileIdentifier: this.editProfileForm.get('profileIdentifier')?.value,
        firstName: this.editProfileForm.get('firstName')?.value,
        lastName: this.editProfileForm.get('lastName')?.value,
        phoneNumber: this.editProfileForm.get('phoneNumber')?.value || undefined
      };
      this.userService.updateProfile(profileUpdateVM).subscribe({
        next: (response) => {
          this.successMessage = 'Profile updated successfully!';
          this.toastService.showSuccess('Success', this.successMessage);
          this.authService.setUser(profileUpdateVM);
          this.router.navigate(['/profile']);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update profile.';
          this.toastService.showError(
            'Error',
            err.error.message || this.errorMessage
          );
          this.isLoading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }

  // Getter methods for form validation
  get f() { return this.editProfileForm.controls; }
}