import { Recipe } from '../recipe.model';
import { RecipesActions, SET_RECIPES, ADD_RECIPE, UPDATE_RECIPE, DELETE_RECIPE } from './recipe.actions';

export interface IRecipeState {
    recipes: Recipe[];
}

const initialState: IRecipeState = {
    recipes: []
};

export const recipeReducer = (state = initialState, action: RecipesActions) => {
    switch (action.type) {
        case SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case UPDATE_RECIPE:
            const recipes = state.recipes.map((recipe) => {
                if (recipe.id === action.payload.id) {
                    return action.payload.newRecipe;
                }

                return recipe;
            });
            return {
                ...state,
                recipes
            };
        case DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe) => recipe.id !== action.payload)
            };
        default:
            return state;
    }
};
