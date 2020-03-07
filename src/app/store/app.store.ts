import { authReducer } from './../auth/store/auth.reducer';
import { IShoppingListState, shoppingListReducer } from './../shopping-list/store/shopping-list.reducer';
import { IAuthState } from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';


export interface IAppState {
    shoppingList: IShoppingListState;
    auth: IAuthState;
}


export const appReducer: ActionReducerMap<IAppState> = {
    shoppingList: shoppingListReducer,
    auth: authReducer
};
