import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface DepositDialogData {
  currentBalance: number;
}

@Component({
  selector: 'app-deposit-dialog',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './deposit-dialog.component.html',
  styleUrl: './deposit-dialog.component.css'
})
export class DepositDialogComponent {
  depositForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DepositDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepositDialogData
  ) {
    this.depositForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  onDeposit(): void {
    if (this.depositForm.valid) {
      this.dialogRef.close(this.depositForm.value);
    }
  }
}