import { Component, OnInit } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { TabsModule } from 'primeng/tabs'; // Ensure correct import
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button'; // Add Button Module

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RatingModule, 
    TabsModule, 
    FormsModule, 
    HttpClientModule,
    ButtonModule // Add Button Module here
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
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.fetchProfile();
  }
  
  private fetchProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profileData) => {
        this.profile = profileData;
      },
      error: (err) => {
        this.errorMessage = 'Unable to fetch profile. Please log in again.';
        this.router.navigate(['/login']);
      }
    });
  }
}