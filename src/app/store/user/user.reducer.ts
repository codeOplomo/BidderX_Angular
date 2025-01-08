import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { initialState } from './user.state';

export const UserReducer = createReducer(
    initialState,
    
    on(UserActions.updateUserImageSuccess, (state, { imageUrl }) => ({
      ...state,
      user: { ...state.user, imageUrl },
      loading: false,
      error: null
    })),    
    on(UserActions.loadUserProfile, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UserActions.loadUserProfileSuccess, (state, { user }) => ({
      ...state,
      user,
      loading: false,
      error: null
    })), 
    on(UserActions.loadUserProfileFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(UserActions.updateUserProfile, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UserActions.updateUserProfileSuccess, (state, { user }) => {
      console.log('Updated user:', user); // Add a log here
      return {
        ...state,
        user,
        loading: false,
        error: null
      };
    }),
    on(UserActions.updateUserProfileFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(UserActions.clearUserProfile, () => initialState)
  );