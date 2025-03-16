import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';
import { ProfileVM } from '../../models/view-models/profile';

export const selectUserState = createFeatureSelector<UserState>('profile');

export const selectUser = createSelector(
  selectUserState,
  state => state.user
);

export const selectCurrentUserEmail = createSelector(
  selectUser,
  (user: ProfileVM | null) => user?.email || null
);

export const selectUserLoading = createSelector(
  selectUserState,
  state => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  state => state.error
);