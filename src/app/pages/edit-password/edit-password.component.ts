import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { ToastService } from '../../services/toast.service';
import { PasswordUpdateVM } from '../../models/view-models/password-update.model';

@Component({
  selector: 'app-edit-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, ButtonModule, Toast],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.css',
  providers: [ToastService]
})


export class EditPasswordComponent {

  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const passwordUpdateVM: PasswordUpdateVM = {
        oldPassword: this.passwordForm.get('oldPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value
      };
      this.userService.updatePassword(passwordUpdateVM).subscribe({
        next: () => {
          this.successMessage = 'Password updated successfully!';
          this.toastService.showSuccess('Success', this.successMessage);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.errorMessage = 'Error updating password. Please try again.';
          this.toastService.showError('Error', this.errorMessage);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}
