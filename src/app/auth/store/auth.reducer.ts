import { AuthActions, AUTHENTICATE_SUCCESS, LOGOUT, LOGIN_START, AUTHENTICATE_FAIL, SIGNUP_START, CLEAR_ERROR } from './auth.actions';
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
        case AUTHENTICATE_SUCCESS:
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
        case SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        case CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };
        default:
            return state;
    }
};
