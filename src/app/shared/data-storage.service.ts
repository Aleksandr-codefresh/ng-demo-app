import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipieService } from '../recipes/recipie.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IAppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { SetRecipes } from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipieService,
              private store: Store<IAppState>) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipies();
    this.http.put('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json', recipes)
      .subscribe((response) => console.log(response));
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json')
    .pipe(map((rec) => {
      return rec.map((recipe) => {
        return { ...recipe, ingredients: recipe.ingredients || [] };
      });
    }),
    tap((recipes) => this.store.dispatch(new SetRecipes(recipes))));
  }
}

