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
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);