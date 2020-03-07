import { User } from './../user.model';


export interface IAuthState {
    user: User;
}


const initialState: IAuthState = {
    user: null
};


export const authReducer = (state = initialState, action) => {
    return state;
};
