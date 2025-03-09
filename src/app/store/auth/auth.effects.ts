import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of, Subject, switchMap, tap } from "rxjs";
import * as AuthActions from "./auth.actions";
import * as UserActions from "../user/user.actions";
import * as WalletActions from "../wallet/wallet.actions";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
    private readonly actions$ = inject(Actions);
    private readonly store = inject(Store);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private destroy$ = new Subject<void>();


    login$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.login),
          exhaustMap(action => 
            this.authService.login(action.credentials).pipe(
              map(response => AuthActions.loginSuccess({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
              })),
              catchError(error => of(AuthActions.loginFailure({
                error: error.error?.message || 'Login failed. Please check your credentials.'
              })))
            )
          )
        );
      });
    
      loginSuccess$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.loginSuccess),
          tap(({ accessToken, refreshToken }) => {
            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            this.authService.setLoggedInStatus(true);
            
            // Load user profile
            this.store.dispatch(UserActions.loadUserProfile());
            
            // Navigate
            this.router.navigate(['/dashboard']);
          })
        );
      }, { dispatch: false });
    
      loginFailure$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.loginFailure),
          tap(({ error }) => {
            console.error('Login error:', error);
            // Clear tokens on failure
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          })
        );
      }, { dispatch: false });

    logout$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.logout),
          exhaustMap(() => this.authService.logout().pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError(error => of(AuthActions.logoutFailure({ error })))
          ))
        );
      });
    
      logoutSuccess$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.logoutSuccess),
          tap(() => {
            // Clear local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRoles');
            
            // Reset state
            this.store.dispatch(UserActions.clearUserProfile());
            this.store.dispatch(WalletActions.resetWalletState());
            
            // Update login status
            this.authService.setLoggedInStatus(false);
          }),
          tap(() => this.router.navigate(['/login'])),
          map(() => ({ type: 'LOGOUT_COMPLETE' }))
        );
      }, { dispatch: false });
    
      logoutFailure$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.logoutFailure),
          tap(({ error }) => {
            console.error('Logout failed:', error);
            // Force client-side cleanup even if server logout failed
            localStorage.clear();
            this.store.dispatch(UserActions.clearUserProfile());
            this.router.navigate(['/login']);
          })
        );
      }, { dispatch: false });
}