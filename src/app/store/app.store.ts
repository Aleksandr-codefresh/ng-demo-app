import { authReducer } from './../auth/store/auth.reducer';
import { IShoppingListState, shoppingListReducer } from './../shopping-list/store/shopping-list.reducer';
import { IAuthState } from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { recipeReducer, IRecipeState } from '../recipes/store/recipe.reducer';


export interface IAppState {
    shoppingList: IShoppingListState;
    auth: IAuthState;
    recipes: IRecipeState;
}


export const appReducer: ActionReducerMap<IAppState> = {
    shoppingList: shoppingListReducer,
    auth: authReducer,
    recipes: recipeReducer
};
