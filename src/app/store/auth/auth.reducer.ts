import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { AuthState } from "./auth.state";

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('accessToken'), 
    userRoles: JSON.parse(localStorage.getItem('userRoles') || '[]'),
  };

export const authReducer = createReducer(
    initialState,
    on(AuthActions.setUserRoles, (state, { roles }) => ({
        ...state,
        userRoles: roles
      })),
      on(AuthActions.setAuthenticated, (state, { isAuthenticated }) => ({
        ...state,
        isAuthenticated
      })),
      on(AuthActions.logoutSuccess, () => initialState)
)