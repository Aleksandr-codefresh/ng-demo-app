import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.module';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  editedItemIndex: number;
  editMode = false;
  editedItem: Ingredient;

  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(
      private shoppingListService: ShoppingListService,
      private store: Store<{ shoppingList: { ingredients: Ingredient[] }}>
    ) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEdtingObservable
      .subscribe((index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(
      value.name,
      value.amount,
    );
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
        this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.clearForm();
  }

  clearForm(): void {
    this.editMode = false;
    this.slForm.reset();
  }

  deleteItem(): void {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.clearForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
