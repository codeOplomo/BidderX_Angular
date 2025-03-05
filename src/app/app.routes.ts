import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateCollectionComponent } from './pages/create-collection/create-collection.component';
import { CollectionShowcaseComponent } from './pages/collection-showcase/collection-showcase.component';
import { CreateAuctionComponent } from './pages/create-auction/create-auction.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { authGuard } from './guards/auth.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AuctionsDashComponent } from './pages/auctions-dash/auctions-dash.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { PaymentConfirmationComponent } from './components/payment-confirmation/payment-confirmation.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'verification', component: VerifyComponent},
            { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
            { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
            { path: 'edit-password', component: EditPasswordComponent, canActivate: [authGuard] },
            { path: 'create-collection', component: CreateCollectionComponent, canActivate: [authGuard], data: { roles: ['OWNER'] } },
            { path: 'create-auction', component: CreateAuctionComponent, canActivate: [authGuard], data: { roles: ['OWNER'] } },
            { path: 'collection-showcase/:id', component: CollectionShowcaseComponent},
            { path: 'product-detail/:id', component: ProductDetailComponent},
            { path: 'payment-success', component: PaymentSuccessComponent},
            { path: 'payment-cancel', component: PaymentCancelComponent},
            { path: 'payment-confirmation', component: PaymentConfirmationComponent}
        ]
    },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        children: [
            { path: '', component: AuctionsDashComponent}
        ]
    },
];
