import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    IconField,
    InputIcon,
    Toast,
    HttpClientModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ToastService, AuthService]
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      profileIdentifier: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(255)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+?[0-9]{10,14}$/)
      ]]
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  
  checkPasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
  
    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      this.registerForm.get('confirmPassword')?.setErrors(null);
    }
  }
  
  // Convenience getter for easy access to form controls
  get f() { return this.registerForm.controls; }

  // Method to check if a form control should show error
  isFieldInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && 
      (control.invalid && 
      (control.dirty || control.touched || this.submitted))
    );
  }

  // Method to get specific error message
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    
    if (control?.errors) {
      if (control.errors['required']) {
        return `${this.formatControlName(controlName)} is required.`;
      }
      
      if (controlName === 'email' && control.errors['email']) {
        return 'Invalid email format.';
      }

      if (controlName === 'password') {
        if (control.errors['minlength']) {
          return 'Password must be at least 8 characters.';
        }
        if (control.errors['pattern']) {
          return 'Password must contain uppercase, lowercase, and a digit.';
        }
      }

      if (controlName === 'phoneNumber' && control.errors['pattern']) {
        return 'Invalid phone number format.';
      }
    }
    
    return '';
  }

  // Helper method to format control name for error messages
  private formatControlName(controlName: string): string {
    return controlName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  onRegister() {
    this.submitted = true;
    
    // Mark all fields as touched to trigger validation
    this.registerForm.markAllAsTouched();
    
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      
      this.loading = true;
      
      // Use the AuthService to send the registration request
      this.authService.register(registerData).subscribe({
        next: (response) => {
          // Show success message using ToastService
          this.toastService.showSuccess(
            'Registration Successful', 
            'Please check your email for a verification code.',
            9000  // Display for 3 seconds
          );
          
          // Redirect to verification page, passing the registered email
          this.router.navigate(['/verification'], { 
            queryParams: { email: registerData.email }
          });
          
          this.loading = false;
        },
        error: (err) => {
          // Show error message using ToastService
          this.toastService.showError(
            'Registration Failed', 
            err.error?.message || 'An error occurred',
            9000  // Display for 3 seconds
          );
          
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
  
}

