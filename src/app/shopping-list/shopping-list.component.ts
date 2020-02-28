import { StartEdit } from './store/shopping-list.actions';
import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<Ingredient[]>;

  constructor(
      private store: Store<AppState>
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
        .pipe(pluck('ingredients'));
  }

  onEditItem(index: number) {
      this.store.dispatch(new StartEdit(index));
  }
}
