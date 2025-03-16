import { createAction, props } from "@ngrx/store";

export const login = createAction(
    '[Auth] Login',
    props<{ credentials: { email: string; password: string } }>()
  );
  
  export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ accessToken: string; refreshToken: string }>()
  );
  
  export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
  );

  export const setUserRoles = createAction(
    '[Auth] Set User Roles',
    props<{ roles: string[] }>()
  )
  
export const setAuthenticated = createAction(
  '[Auth] Set Authenticated',
  props<{ isAuthenticated: boolean }>()
);

export const loadAuthState = createAction('[Auth] Load Auth State');

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);