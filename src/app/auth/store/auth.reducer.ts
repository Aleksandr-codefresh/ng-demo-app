import { AuthActions, LOGIN, LOGOUT, Logout } from './auth.actions';
import { User } from './../user.model';


export interface IAuthState {
    user: User;
}


const initialState: IAuthState = {
    user: null
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
                user
            };
        case LOGOUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
};
