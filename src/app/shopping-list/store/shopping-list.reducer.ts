import { Ingredient } from '../../shared/ingredient.module';
import { ShoppingListActions, ADD_INGREDIENT, ADD_INGREDIENTS, UPDATE_INGREDIENT, DELETE_INGREDIENT, START_EDIT, STOP_EDIT } from './shopping-list.actions';

export interface AppState {
    shoppingList: ShoppingListState;
}
export interface ShoppingListState {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState = {
    ingredients: [
        new Ingredient('Tomatos', 2),
        new Ingredient('Apples', 5)
      ],
    editedIngredient: null,
    editedIngredientIndex: -1
};


export const shoppingListReducer = (state: ShoppingListState = initialState, action: ShoppingListActions) => {
    switch (action.type) {
        case ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [ ...state.ingredients, action.payload]
            };
            case ADD_INGREDIENTS:
                return {
                    ...state,
                    ingredients: [ ...state.ingredients, ...action.payload]
                };
            case UPDATE_INGREDIENT:
                const  ingredient = state.ingredients[state.editedIngredientIndex];
                const updatedIngredient = {
                    ...ingredient,
                    ...action.payload
                };
                const updatedIngredients = [...state.ingredients];
                updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
                return {
                    ...state,
                    ingredients: updatedIngredients,
                    editedIngredientIndex: -1,
                    editedIngredient: null
                };
            case DELETE_INGREDIENT:
                return {
                    ...state,
                    ingredients: state.ingredients.filter((_, index) => index !== state.editedIngredientIndex),
                    editedIngredientIndex: -1,
                    editedIngredient: null
                };
            case START_EDIT:
                return {
                    ...state,
                    editedIngredientIndex: action.payload,
                    editedIngredient: { ...state.ingredients[action.payload] }
                };
            case STOP_EDIT:
                return {
                    ...state,
                    editedIngredientIndex: -1,
                    editedIngredient: null
                };
        default:
            return state;
    }
};
