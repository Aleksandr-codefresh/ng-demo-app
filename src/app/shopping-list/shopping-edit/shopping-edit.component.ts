import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.module';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.store';
import { updateIngredient, addIngredient, stopEdit, deleteIngredient } from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(
      private store: Store<IAppState>
    ) { }

  ngOnInit() {
      this.subscription = this.store.select('shoppingList')
          .subscribe((stateData) => {
              if (stateData.editedIngredientIndex > -1) {
                this.editMode = true;
                this.editedItem = stateData.ingredients[stateData.editedIngredientIndex];
                this.slForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                });

              } else {
                  this.editMode = false;
              }
          });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(
      value.name,
      value.amount,
    );
    if (this.editMode) {
        this.store.dispatch(updateIngredient({ ingredient: newIngredient }));
    } else {
        this.store.dispatch(addIngredient({ ingredient: newIngredient }));
    }
    this.clearForm();
  }

  clearForm(): void {
    this.editMode = false;
    this.slForm.reset();
    this.store.dispatch(stopEdit());
  }

  deleteItem(): void {
    this.store.dispatch(deleteIngredient());
    this.clearForm();
  }

  ngOnDestroy() {
    this.store.dispatch(stopEdit());
    this.subscription.unsubscribe();
  }
}
