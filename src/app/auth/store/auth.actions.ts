import { createAction, props } from '@ngrx/store';


export const signupStart = createAction('[Auth] SIGNUP_START', props<{ email: string; password: string; }>());
export const loginStart = createAction('[Auth] LOGIN_START', props<{ email: string; password: string; }>());
export const authenticateFail = createAction('[Auth] AUTHENTICATE_FAIL', props<{ errorMessage: string }>());
export const authenticateSuccess = createAction('[Auth] AUTHENTICATE_SUCCESS', props<{
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
}>());
export const logout = createAction('[Auth] LOGOUT');
export const autoLogin = createAction('[Auth] AUTO_LOGIN');
export const clearError = createAction('[Auth] CLEAR_ERROR');
