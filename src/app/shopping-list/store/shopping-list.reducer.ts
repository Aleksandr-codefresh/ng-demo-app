import { Action } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.module';
import { ADD_INGREDIENT } from './shopping-list.actions';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
    ingredients: [
        new Ingredient('Tomatos', 2),
        new Ingredient('Apples', 5)
      ]
};


export const shoppingListReducer = (state = initialState, action: ShoppingListActions.AddIngredient) => {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [ ...state.ingredients, action.payload]
            };
        default:
            return state;
    }
};
