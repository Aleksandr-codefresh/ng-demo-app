import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Tomatos', 2),
    new Ingredient('Apples', 5)
  ];
  constructor() { }

  ngOnInit() {
  }
  onIngredientAdded(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }
}
