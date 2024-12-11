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
    InputIcon
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
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
      
      // Uncomment and implement actual registration service
      // this.authService.register(registerData).subscribe({
      //   next: (response) => {
      //     // Handle successful registration
      //     this.router.navigate(['/login']);
      //   },
      //   error: (err) => {
      //     // Handle registration error
      //     console.error('Registration error', err);
      //     this.loading = false;
      //   }
      // });
    }
  }
}

