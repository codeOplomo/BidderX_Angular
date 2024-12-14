import { Component, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TabsModule } from 'primeng/tabs'; // Ensure correct import
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RatingModule, 
    TabsModule, 
    FormsModule, 
    SplitButton,
    HttpClientModule,
    ButtonModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  rating: number = 5;
  
  profile: any = {
    email: '',
    phoneNumber: '',
    profileIdentifier: ''
  }
  
  errorMessage: string = '';

  editItems: any[] = [
    {
      label: 'Edit Profile', 
      icon: 'pi pi-pencil', 
      command: () => this.onEditProfile() // Define command for Edit Profile
    },
    {
      label: 'Edit Password', 
      icon: 'pi pi-lock', 
      command: () => this.onEditPassword() // Define command for Edit Password
    }
  ];
  
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  
  ngOnInit() {
    this.fetchProfile();
  }
  
  // Methods to check roles
  isOwner(): boolean {
    return this.authService.hasRole('OWNER');
  }
  
  private fetchProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profileData) => {
        console.log('Fetched Profile Data:', profileData);
        this.profile = profileData;
      },
      error: (err) => {
        this.errorMessage = 'Unable to fetch profile. Please log in again.';
        this.router.navigate(['/login']);
      }
    });
  }
  
  onEditProfile() {
    // Navigate to edit profile page or open edit modal
    this.router.navigate(['/edit-profile']);
  }

  onEditPassword() {
    // Navigate to the edit password page or open edit password modal
    this.router.navigate(['/edit-password']);
  }
  
  onCreateCollection() {
    // Navigate to create collection page
    this.router.navigate(['/create-collection']);
  }
  
  onCreateAuction() {
    // Navigate to create auction page
    this.router.navigate(['/create-auction']);
  }
}