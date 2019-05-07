import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Tomatos', 2),
    new Ingredient('Apples', 5)
  ];
  constructor() { }

  getIngredients(): Ingredient[] {
    return [...this.ingredients];
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }
}
