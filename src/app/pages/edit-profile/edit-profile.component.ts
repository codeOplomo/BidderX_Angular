import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CommonModule, NgIf } from '@angular/common';
import { Toast } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Observable, Subject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { User } from '../../store/user/user.model';
import * as UserActions from '../../store/user/user.actions';
import { selectUserLoading, selectUserError } from '../../store/user/user.selectors';

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
  editProfileForm!: FormGroup;
  user$!: Observable<User | null>;
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public router: Router,
    private toastService: ToastService
  ) {  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    // Fetch user data from the store
    this.user$ = this.store.select(selectUser);

    // Initialize the form with empty values
    this.editProfileForm = this.fb.group({
      profileIdentifier: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]+$/)]],
    });

    // Populate the form once the user data is available
    this.user$.subscribe((user) => {
      if (user) {
        this.editProfileForm.patchValue({
          profileIdentifier: user.profileIdentifier,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        });
      }
    });
  }

  
  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedProfile = this.editProfileForm.value;

    this.store.dispatch(UserActions.updateUserProfile({ profileData: updatedProfile }));

    // Use the store selectors to handle the response
    this.store.pipe(
      select(selectUser),
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user) {
        this.toastService.showSuccess('Success', user.message || 'Profile updated successfully!');
        this.router.navigate(['/profile']);
      }
    });

    this.store.pipe(
      select(selectUserError),
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        const errorMessage = error.message || 'Failed to update profile.';
        this.toastService.showError('Error', errorMessage);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }

  // Getter methods for form validation
  get f() { return this.editProfileForm.controls; }
}