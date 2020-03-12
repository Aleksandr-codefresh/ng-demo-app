import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IAppState } from 'src/app/store/app.store';
import { Recipe } from '../recipe.model';
import { fetchRecipes, setRecipes, storeRecipes } from './recipe.actions';

@Injectable()
export class RecipeEffects {
    fetchRecipes = createEffect(() => this.actions$
        .pipe(
            ofType(fetchRecipes),
            switchMap(() => {
                return this.http.get<Recipe[]>('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json');
            }),
            map((rec) => {
                return rec.map((recipe) => {
                  return { ...recipe, ingredients: recipe.ingredients || [] };
                });
            }),
            map((recipes) => setRecipes({recipes}))
        )
    );

    storeRecipes = createEffect(() => this.actions$
        .pipe(
            ofType(storeRecipes),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => {
                return this.http.put('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json', recipesState.recipes);
            })
        ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<IAppState>
    ) {}
}
