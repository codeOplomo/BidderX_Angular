import { Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-connect-wallet-dialog',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './connect-wallet-dialog.component.html',
  styleUrl: './connect-wallet-dialog.component.css',
})
export class ConnectWalletDialogComponent {
  // loading = false;

  // constructor(
  //   public dialogRef: MatDialogRef<ConnectWalletDialogComponent>,
  //   private walletService: WalletService
  // ) {}

  // connectWallet(): void {
  //   this.loading = true;
  //   this.walletService.connectWallet().subscribe({
  //     next: () => {
  //       this.dialogRef.close(true);
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       // Handle error
  //     }
  //   });
  // }
}
