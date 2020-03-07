import { AuthActions, LOGIN, LOGOUT, LOGIN_START, LOGIN_FAIL } from './auth.actions';
import { User } from './../user.model';


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


export const authReducer = (state = initialState, action: AuthActions) => {
    switch (action.type) {
        case LOGIN:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                user,
                authError: null,
                loading: false
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                authError: null,
                loading: false
            };
        case LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case LOGIN_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        default:
            return state;
    }
};
