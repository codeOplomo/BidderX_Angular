import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as UserActions from './user.actions';
import { Action } from '@ngrx/store';
import { ProfileVM } from '../../models/view-models/profile';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);
  private destroy$ = new Subject<void>();

  
  loadProfile$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUserProfile),
    switchMap(() => this.userService.getProfile().pipe(
      // Extract the .data property from the API response
      map(apiResponse => UserActions.loadUserProfileSuccess({ 
        user: apiResponse.data  // This is the actual ProfileVM
      })),
      catchError(error => of(UserActions.loadUserProfileFailure({ error })))
    ))
  ));

  updateProfile$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.updateUserProfile),
    switchMap(({ profileData }) => {
      if (!profileData.profileIdentifier) {
        return of(UserActions.updateUserProfileFailure({ error: 'Profile identifier is required' }));
      }
      
      return this.userService.updateProfile(profileData).pipe(
        // Map the API response to match the User interface
        map(response => {
          const updatedUser: ProfileVM = {
            profileIdentifier: response.data.profileIdentifier,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            imageUrl: response.data.imageUrl,
            hasWallet: response.data.hasWallet,
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
            this.destroy$, // Provide the destroy$ subject
            (imageUrl) => {
              observer.next(UserActions.updateUserImageSuccess({ imageUrl }));
              observer.complete();
            },
            (loading) => {
              console.log('Loading state:', loading); // Handle loading if necessary
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