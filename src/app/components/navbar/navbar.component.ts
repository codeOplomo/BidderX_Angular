import { Component, OnInit, ViewChild } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterModule } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../services/auth.service';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    NgIf,
    NgClass,
    RouterModule,
    AvatarModule,
    BadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('userMenu') userMenu!: Menu;

  isLoggedIn = false;
  items: any[] = [];
  defaultAvatar = 'assets/default-avatar.png';

  user: any = null;
  dropdownItems = [
    {
        label: 'Profile', // Profile item label
        icon: 'pi pi-user', // Profile icon
        command: () => this.goToProfile(), // Navigate to the profile page
      },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.authService.getProfile().subscribe(profile => {
          this.user = profile;
        });
      } else {
        this.user = null;
      }
    });
  }

  toggleDropdown(event: Event) {
    this.userMenu.toggle(event);
  }

  goToProfile() {
    this.router.navigate(['/profile']); // Navigate to the profile page
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}