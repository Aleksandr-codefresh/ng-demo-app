import { Recipe } from '../recipe.model';
import { setRecipes, addRecipe, updateRecipe, deleteRecipe } from './recipe.actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface IRecipeState {
    recipes: Recipe[];
}

const initialState: IRecipeState = {
    recipes: []
};

export const recipeReducer = (recipeState: IRecipeState | undefined, recipeAction: Action) => {
    return createReducer(
            initialState,
            on(setRecipes, (state, action) => ({ ...state, recipes: [...action.recipes]})),
            on(addRecipe, (state, action) => ({ ...state, recipes: [...state.recipes, action.recipe]})),
            on(updateRecipe, (state, action) =>
                ({ ...state, recipes: state.recipes.map((recipe) => recipe.id === action.id ? action.newRecipe : recipe) })),
            on(deleteRecipe, (state, action) => ({ ...state, recipes: state.recipes.filter((recipe) => recipe.id !== action.id) })),
        )(recipeState, recipeAction);
};
