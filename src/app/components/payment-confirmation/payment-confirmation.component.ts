import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { WalletService } from '../../services/wallet.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.css'
})
export class PaymentConfirmationComponent {
  loading = false;
  success = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private walletService: WalletService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract the session_id from query parameters
    this.route.queryParams.subscribe(params => {
      const sessionId = params['sessionId'];
      console.log('Session ID:', sessionId);
      if (sessionId) {
        this.confirmPayment(sessionId);
      } else {
        // If no sessionId is present, navigate to a default route or show an error
        this.router.navigate(['/']);
      }
    });
  }

  confirmPayment(sessionId: string): void {
    this.loading = true;
    this.paymentService.confirmPayment(sessionId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.success = true;
            // Optionally refresh the wallet details after confirmation
            // this.walletService.refreshWallet();
          } else {
            this.error = 'Payment not completed.';
          }
        },
        error: (err) => {
          this.error = 'Payment verification failed. Please try again.';
        }
      });
  }
}
