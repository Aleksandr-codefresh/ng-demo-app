import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipieService } from '../recipes/recipie.service';

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
}

