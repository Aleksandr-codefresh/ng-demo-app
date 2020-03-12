import { Actions, ofType } from '@ngrx/effects';
import { FetchRecipes, SET_RECIPES } from './store/recipe.actions';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Recipe } from './recipe.model';
import { IAppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(
        private store: Store<IAppState>,
        private actions$: Actions
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Recipe[]> {
        return this.store.select('recipes')
            .pipe(
                take(1),
                switchMap(({recipes}) => {
                    if (recipes.length === 0) {
                        this.store.dispatch(new FetchRecipes());
                        return this.actions$
                            .pipe(
                                ofType(SET_RECIPES),
                                take(1)
                            );
                    }

                    return of(recipes);
                })
            );
    }
}
