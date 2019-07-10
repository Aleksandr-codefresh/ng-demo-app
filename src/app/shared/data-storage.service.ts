import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipieService } from '../recipes/recipie.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipieService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipies();
    this.http.put('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json', recipes)
      .subscribe((response) => console.log(response));
  }

  fetchRecipes(): void {
    this.http.get<Recipe[]>('https://ng-course-recipe-book-cfc28.firebaseio.com/recipes.json')
    .pipe(map((rec) => {
      return rec.map((recipe) => {
        return { ...recipe, ingredients: recipe.ingredients || [] };
      });
    }))
    .subscribe((recipes) => this.recipeService.setRecipes(recipes));
  }
}

