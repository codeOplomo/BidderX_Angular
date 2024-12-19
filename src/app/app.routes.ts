import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'verification', component: VerifyComponent},
            { path: 'profile', component: ProfileComponent },
            { path: 'edit-profile', component: EditProfileComponent },
            { path: 'edit-password', component: EditPasswordComponent }
            // Add other routes here
        ]
    }
];
