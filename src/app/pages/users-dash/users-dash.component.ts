import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { ProfileVM } from '../../models/view-models/profile';
import { ApiResponse } from '../../models/view-models/api-response.model';

@Component({
  selector: 'app-users-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-dash.component.html',
  styleUrl: './users-dash.component.css',
  providers: [ToastService]
})
export class UsersDashComponent {
  users: ProfileVM[] = [];
  isLoading = false;

  constructor(private userService: UserService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res: ApiResponse<ProfileVM[]>) => {
        this.users = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.showError('Error', 'Failed to load users');
        this.isLoading = false;
      }
    });
  }

  approveRequest(user: ProfileVM): void {
    this.userService.approveOwnerRequest(user.email!).subscribe({
      next: (res: ApiResponse<any>) => {
        this.toastService.showSuccess('Success', res.message);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.showError('Error', 'Failed to approve request');
      }
    });
  }

  rejectRequest(user: ProfileVM): void {
    // const reason = prompt('Enter rejection reason:');
    // if (!reason) {
    //   return;
    // }
    this.userService.rejectOwnerRequest(user.email!).subscribe({
      next: (res: ApiResponse<any>) => {
        this.toastService.showSuccess('Success', res.message);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.showError('Error', 'Failed to reject request');
      }
    });
  }

  banUser(user: ProfileVM): void {
    if (!user.email) return;
    this.userService.banUser(user.email).subscribe({
      next: (res: ApiResponse<any>) => {
        this.toastService.showSuccess('Success', res.message);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.showError('Error', 'Failed to ban user');
      }
    });
  }

  unbanUser(user: ProfileVM): void {
    if (!user.email) return;
    this.userService.unbanUser(user.email).subscribe({
      next: (res: ApiResponse<any>) => {
        this.toastService.showSuccess('Success', res.message);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.showError('Error', 'Failed to unban user');
      }
    });
  }
}
