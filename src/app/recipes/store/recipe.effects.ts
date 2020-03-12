import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { FETCH_RECIPES, SetRecipes, STORE_RECIPES } from './recipe.actions';
import { Actions, Effect, ofType, EffectsModule } from '@ngrx/effects';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { IAppState } from 'src/app/store/app.store';
import { Store } from '@ngrx/store';

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

    @Effect({ dispatch: false })
    storeRecipes = this.actions$
        .pipe(
            ofType(STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => {
                return this.http.put('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json', recipesState.recipes);
            })
        );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<IAppState>
    ) {}
}
