import { createAction, props } from '@ngrx/store';

export const loadUserProfile = createAction('[User] Load Profile');

export const updateUserImage = createAction(
  '[User] Update Profile Image',
  props<{ imageFile: File }>() // Expect a File object
);


export const updateUserImageSuccess = createAction(
  '[User] Update Profile Image Success',
  props<{ imageUrl: string }>()
);

export const updateUserImageFailure = createAction(
  '[User] Update Profile Image Failure',
  props<{ error: any }>()
);

export const loadUserProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ user: any }>()
);
export const loadUserProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: any }>()
);

export const updateUserProfile = createAction(
  '[User] Update Profile',
  props<{ profileData: any }>()
);
export const updateUserProfileSuccess = createAction(
  '[User] Update Profile Success',
  props<{ user: any }>()
);
export const updateUserProfileFailure = createAction(
  '[User] Update Profile Failure',
  props<{ error: any }>()
);

export const clearUserProfile = createAction('[User] Clear Profile');
