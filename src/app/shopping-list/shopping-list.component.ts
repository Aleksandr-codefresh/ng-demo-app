import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from './shopping-list.service';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<Ingredient[]>;

  constructor(
      private shoppingListService: ShoppingListService,
      private store: Store<{ shoppingList: { ingredients: Ingredient[] }}>
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
        .pipe(pluck('ingredients'));
  }

  addIngredient(ingredient: Ingredient): void {
    // this.ingredients.push(ingredient);
  }

  onEditItem(index: number) {
    this.shoppingListService.setEditingIngredient(index);
  }
}
