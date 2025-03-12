import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";


export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUserRoles = createSelector(
    selectAuthState,
    (state: AuthState) => state.userRoles
)

export const selectIsOwner = createSelector(
  selectUserRoles,
  (roles: string[] = []) => roles.includes('ROLE_OWNER')
)

export const selectIsBidder = createSelector(
  selectUserRoles,
    (roles: string[] = []) => roles.includes('ROLE_BIDDER')
)

export const selectIsAdmin = createSelector(
  selectUserRoles,
  (roles: string[] = []) => roles.includes('ROLE_ADMIN')
)

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isAuthenticated ?? false
);

