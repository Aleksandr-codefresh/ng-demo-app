import { createReducer, on, Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.module';
import {
    addIngredient,
    addIngredients,
    deleteIngredient,
    startEdit,
    stopEdit,
    updateIngredient
} from './shopping-list.actions';

export interface IShoppingListState {
    ingredients: Ingredient[];
    editedIngredientIndex: number;
}

const initialState = {
    ingredients: [
        new Ingredient('Tomatos', 2),
        new Ingredient('Apples', 5)
      ],
    editedIngredientIndex: -1
};


export const shoppingListReducer = (shoppingListState: IShoppingListState | undefined, shoppingListAction: Action) => {
    return createReducer(
            initialState,
            on(addIngredient, (state, action) => ({ ...state, ingredients: [...state.ingredients, action.ingredient]})),
            on(addIngredients, (state, action) => ({ ...state, ingredients: [...state.ingredients, ...action.ingredients]})),
            on(updateIngredient, (state, action) => ({
                ...state,
                editedIngredientIndex: -1,
                ingredients: state.ingredients.map((ingredient, index) =>
                    index === state.editedIngredientIndex ? { ...action.ingredient } : ingredient)
            })),
            on(deleteIngredient, state => ({
                ...state,
                editedIngredientIndex: -1,
                ingredients: state.ingredients.filter((ingredient, index) => index !== state.editedIngredientIndex)
            })),
            on(startEdit, (state, action) => ({ ...state, editedIngredientIndex: action.index })),
            on(stopEdit, state => ({ ...state, editedIngredientIndex: -1 }))
        )(shoppingListState, shoppingListAction);
};
