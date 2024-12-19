import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DividerModule } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    InputTextModule, 
    ButtonModule, 
    CardModule, 
    PasswordModule, 
    FormsModule, 
    InputGroupAddonModule, 
    DividerModule, 
    IconField, 
    InputIcon
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  errorMessage: string = '';
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form controls
  get f() { return this.loginForm.controls; }

  // Method to check if a form control should show error
  isFieldInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && 
      (control.invalid && 
      (control.dirty || control.touched || this.submitted))
    );
  }

  // Method to get specific error message
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    
    if (control?.errors) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required.`;
      }
      
      if (controlName === 'email' && control.errors['email']) {
        return 'Invalid email format.';
      }
    }
    
    return '';
  }

  onLogin() {
    this.submitted = true;
  
    // Mark all fields as touched to trigger validation
    this.loginForm.markAllAsTouched();
  
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      const loginData = { email, password };
  
      this.loading = true;
      this.errorMessage = ''; // Clear any previous error messages
  
      this.authService.login(loginData).subscribe({
        next: (response) => {
          // Successful login 
          // Token is now stored in the service's login method
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
          console.error('Login error', err);
          this.loading = false;
        }
      });
    }
  }
  

  // private redirectBasedOnRole(role: string) {
  //   switch(role) {
  //     case 'ADMIN':
  //       this.router.navigate(['/admin-dashboard']);
  //       break;
  //     case 'OWNER':
  //       this.router.navigate(['/owner-dashboard']);
  //       break;
  //     case 'BIDDER':
  //       this.router.navigate(['/bidder-dashboard']);
  //       break;
  //     default:
  //       this.router.navigate(['/']);
  //   }
  // }
}
