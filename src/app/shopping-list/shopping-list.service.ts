import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private ingredientsChanged = new Subject<Ingredient[]>();
  private startedEdting = new Subject<number>();
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

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.getIngredients());
  }

  setEditingIngredient(index: number) {
    this.startedEdting.next(index);
  }

  get startedEdtingObservable(): Observable<number> {
    return this.startedEdting.asObservable();
  }
}
