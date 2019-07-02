import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipieService {
  private recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'A test recipe',
      'This is simply a test',
      'https://img.taste.com.au/gD11HemW/w720-h480-cfill-q80/taste/2016/11/butter-chicken-with-naan-81484-1.jpeg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ],
      '1'
      ),
    new Recipe(
      'Recipe 2',
      'This is simply a test 2',
// tslint:disable-next-line: max-line-length
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2Fimage%2Frecipes%2Fck%2F11%2F04%2Ffettuccine-olive-oil-ck-x.jpg%3Fitok%3Dbt5Cny7R&w=450&c=sc&poi=face&q=85',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 3)
      ],
      '2'
      )
  ];
  constructor(private shoppingListService: ShoppingListService) { }

  getRecipies(): Recipe[] {
    return [...this.recipes];
  }

  get recipeChangedObservable(): Observable<Recipe[]> {
    return this.recipeChanged.asObservable();
  }

  getRecipeBuId(id: string): Recipe {
    return this.recipes.find((recipe: Recipe) => recipe.id === id);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.getRecipies());
  }

  updateRecipe(newRecipe: Recipe): void {
    const index = this.recipes.findIndex((recipe: Recipe) => recipe.id === newRecipe.id);
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.getRecipies());
  }

  deleteRecipe(id: string): void {
    const index = this.recipes.findIndex((recipe: Recipe) => recipe.id === id);
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.getRecipies());
  }
}
