import { Action, createReducer, on } from '@ngrx/store';
import { User } from './../user.model';
import { signupStart, loginStart, authenticateFail, authenticateSuccess, logout, clearError } from './auth.actions';


export interface IAuthState {
    user: User;
    authError: string;
    loading: boolean;
}


const initialState: IAuthState = {
    user: null,
    authError: null,
    loading: false
};


export const authReducer = (authState: IAuthState | undefined, authAction: Action) => {
    return createReducer(
        initialState,
        on(signupStart, (state) => ({ ...state, authError: null, loading: true })),
        on(loginStart, (state) => ({ ...state, authError: null, loading: true })),
        on(authenticateSuccess, (state, action) => ({
            ...state,
            authError: null,
            loading: false,
            user: new User(action.email, action.userId, action.token, action.expirationDate)
        })),
        on(authenticateFail, (state, action) => ({  ...state, user: null, authError: action.errorMessage, loading: false})),
        on(logout, state => ({...state, user: null })),
        on(clearError, state => ({...state, authError: null }))

    )(authState, authAction);
};
