import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private ingredientsChanged = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Tomatos', 2),
    new Ingredient('Apples', 5)
  ];

  get ingredientsChangedObservable(): Observable<Ingredient[]> {
    return this.ingredientsChanged.asObservable();
  }

  getIngredients(): Ingredient[] {
    return [...this.ingredients];
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.getIngredients());
  }
}
