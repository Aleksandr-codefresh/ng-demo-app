import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipieService } from './recipie.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private dataStorageService: DataStorageService,
              private recipeService: RecipieService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Recipe[]> {
    const recipes = this.recipeService.getRecipies();
    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    }
    return of(recipes);
  }
}
