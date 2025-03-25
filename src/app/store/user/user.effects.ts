import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as UserActions from './user.actions';
import * as WalletActions from '../wallet/wallet.actions';
import { Action, Store } from '@ngrx/store';
import { ProfileVM } from '../../models/view-models/profile';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly store = inject(Store);
  private destroy$ = new Subject<void>();

  
loadProfile$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(UserActions.loadUserProfile),
    switchMap(() =>
      this.userService.getProfile().pipe(
        tap(response => console.log('DEBUG from user effects: Profile API response:', response.data)),
        map((response) => {
          const user: ProfileVM = {
            email: response.data.email,
            profileIdentifier: response.data.profileIdentifier,
            phoneNumber: response.data.phoneNumber,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            imageUrl: response.data.imageUrl,
            hasWallet: response.data.hasWallet,
            coverImageUrl: response.data.coverImageUrl,
            wallet: response.data.wallet ? {
              id: response.data.wallet.id,
              type: response.data.wallet.type,
              balance: response.data.wallet.balance,
              currencyCode: response.data.wallet.currencyCode,
              transactions: response.data.wallet.transactions,
              userId: response.data.wallet.userId,
              checkoutUrl: response.data.wallet.checkoutUrl
            } : null,
            collections: response.data.collections,
            roles: response.data.roles || []
          };

          if (user.hasWallet && user.wallet) {
            this.store.dispatch(WalletActions.loadWalletSuccess({
              wallet: user.wallet
            }));
          }
          
          return UserActions.loadUserProfileSuccess({ user });
        }),
        catchError((error) => of(UserActions.loadUserProfileFailure({ error })))
      )
    )
  );
});

  updateProfile$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.updateUserProfile),
    switchMap(({ profileData }) => {
      if (!profileData.profileIdentifier) {
        return of(UserActions.updateUserProfileFailure({ error: 'Profile identifier is required' }));
      }
      
      return this.userService.updateProfile(profileData).pipe(
        map(response => {
          const updatedUser: ProfileVM = {
            profileIdentifier: response.data.profileIdentifier,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            imageUrl: response.data.imageUrl,
            hasWallet: response.data.hasWallet,
            roles: response.data.roles || [],
          };
          return UserActions.updateUserProfileSuccess({ user: updatedUser });
        }),
        catchError(error => {
          console.error('Update error:', error);
          return of(UserActions.updateUserProfileFailure({ error }));
        })
      );
    })
  ));

  updateImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserImage),
      switchMap(({ imageFile }) =>
        new Observable<Action>((observer) => {
          this.userService.uploadProfileImage(
            this.destroy$, 
            (imageUrl) => {
              observer.next(UserActions.updateUserImageSuccess({ imageUrl }));
              observer.complete();
            },
            (loading) => {
              console.log('Loading state:', loading); 
            }
          );
        }).pipe(
          catchError((error) =>
            of(UserActions.updateUserImageFailure({ error }))
          )
        )
      )
    )
  );
}