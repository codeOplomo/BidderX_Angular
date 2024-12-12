import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterModule } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        MenubarModule,
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
    isLoggedIn = false;
    items: any[] = [];

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        // Check login status and subscribe to any changes
        this.authService.isLoggedIn$.subscribe(loggedIn => {
            this.isLoggedIn = loggedIn;
        });
    }

    logout() {
        this.authService.logout();
        // The service will handle updating the login status
        this.router.navigate(['/login']);
    }
}