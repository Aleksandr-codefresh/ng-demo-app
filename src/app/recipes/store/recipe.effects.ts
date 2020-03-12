import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { FETCH_RECIPES, SetRecipes } from './recipe.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$
        .pipe(
            ofType(FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json');
            }),
            map((rec) => {
                return rec.map((recipe) => {
                  return { ...recipe, ingredients: recipe.ingredients || [] };
                });
            }),
            map((recipes) => new SetRecipes(recipes))
        );
    constructor(
        private actions$: Actions,
        private http: HttpClient
    ) {}
}
