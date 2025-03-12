import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { headersInterceptor } from './interceptor/headers.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/user/user.effects';
import { UserReducer } from './store/user/user.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { collectionReducer } from './store/collections/collection.reducer';
import { CollectionEffects } from './store/collections/collection.effects';
import { walletReducer } from './store/wallet/wallet.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { WalletEffects } from './store/wallet/wallet.effects';
import { authReducer } from './store/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptors([headersInterceptor])),
    importProvidersFrom(TabsModule),
    importProvidersFrom(ButtonModule),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideStore({ profile: UserReducer, collection: collectionReducer, wallet: walletReducer, auth: authReducer }),
    provideEffects([UserEffects, CollectionEffects, AuthEffects, WalletEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }), provideAnimationsAsync()
  ]
};
