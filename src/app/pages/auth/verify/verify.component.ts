import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ToastService } from '../../../services/toast.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    IconField,
    InputIcon,
    HttpClientModule
  ],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  providers: [ToastService, AuthService]
})
export class VerifyComponent implements OnInit {
  public verifyForm!: FormGroup;
  submitted = false;
  loading = false;
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Extract email from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    this.verifyForm = this.formBuilder.group({
      email: [{value: this.email, disabled: true}],
      verificationCode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]+$/)
      ]]
    });
  }

  // Convenience getter for easy access to form controls
  get f() { return this.verifyForm.controls; }

    // Method to check if a form control should show error
    isFieldInvalid(controlName: string): boolean {
      const control = this.verifyForm.get(controlName);
      return !!(control && 
        (control.invalid && 
        (control.dirty || control.touched || this.submitted))
      );
    }
  
    // Method to get specific error message
    getErrorMessage(controlName: string): string {
      const control = this.verifyForm.get(controlName);
      
      if (control?.errors) {
        if (control.errors['required']) {
          return `${this.formatControlName(controlName)} is required.`;
        }
        if (control.errors['pattern']) {
          return 'Verification code must be numeric.';
        }
        if (control.errors['minlength'] || control.errors['maxlength']) {
          return 'Verification code must be exactly 6 digits.';
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
  
    onVerify() {
      this.submitted = true;
      this.verifyForm.markAllAsTouched();
    
      if (this.verifyForm.valid) {
        this.loading = true;
    
        const verifyData = {
          email: this.email,
          verificationCode: this.verifyForm.get('verificationCode')?.value
        };
    
        // Call the verifyUser API and handle responses
        this.authService.verifyUser(verifyData).pipe(
          tap({
            next: (response) => {
              if (response && response.message) {
                this.toastService.showSuccess(
                  'Verification Successful',
                  response.message,
                  3000
                );
    
                // Wait for the toast to show before navigating
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 3000); // Adjust delay if necessary
              }
              this.loading = false;
            },
            error: (err) => {
              const errorMessage = err?.error?.message || 'An error occurred during verification.';
              this.toastService.showError('Verification Failed', errorMessage, 3000);
              this.loading = false;
            }
          })
        ).subscribe();
      } else {
        this.loading = false;
      }
    }
    
    
  }
  
