import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  sidebarExpanded = true;
  themeMenuOpen = false;
  notificationsOpen = false;
  profileMenuOpen = false;
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get current route for highlighting active menu item
    const url = this.router.url;
    if (url.includes('auctions')) {
      this.currentRoute = 'auctions';
    } else if (url.includes('requests')) {
      this.currentRoute = 'requests';
    } else if (url.includes('users')) {
      this.currentRoute = 'users';
    } else if (url.includes('analytics')) {
      this.currentRoute = 'analytics';
    } else if (url.includes('settings')) {
      this.currentRoute = 'settings';
    }
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  toggleThemeMenu(): void {
    this.themeMenuOpen = !this.themeMenuOpen;
    this.notificationsOpen = false;
    this.profileMenuOpen = false;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.themeMenuOpen = false;
    this.profileMenuOpen = false;
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    this.themeMenuOpen = false;
    this.notificationsOpen = false;
  }

  setTheme(theme: string): void {
    // Implement theme switching logic
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.themeMenuOpen = false;
  }

}
