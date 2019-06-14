import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private subscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this. subscription = this.shoppingListService.ingredientsChangedObservable
      .subscribe((ingredients: Ingredient[]) => this.ingredients = ingredients);
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

  onEditItem(index: number) {
    this.shoppingListService.setEditingIngredient(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
