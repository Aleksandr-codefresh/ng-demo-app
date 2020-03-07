import { UpdateIngredient, DeleteIngredient, StopEdit } from './../store/shopping-list.actions';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.module';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient } from '../store/shopping-list.actions';
import { IAppState } from 'src/app/store/app.store';

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
                this.editedItem = stateData.editedIngredient;
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
        this.store.dispatch(new UpdateIngredient(newIngredient));
    } else {
        this.store.dispatch(new AddIngredient(newIngredient));
    }
    this.clearForm();
  }

  clearForm(): void {
    this.editMode = false;
    this.slForm.reset();
    this.store.dispatch(new StopEdit());
  }

  deleteItem(): void {
    this.store.dispatch(new DeleteIngredient());
    this.clearForm();
  }

  ngOnDestroy() {
    this.store.dispatch(new StopEdit());
    this.subscription.unsubscribe();
  }
}
