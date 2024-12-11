import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';

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
export class NavbarComponent {
    isLoggedIn = false;
    items: any[] = [];
}