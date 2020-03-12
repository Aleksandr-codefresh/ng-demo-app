import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.store';
import { startEdit } from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<Ingredient[]>;

  constructor(
      private store: Store<IAppState>
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
        .pipe(pluck('ingredients'));
  }

  onEditItem(index: number) {
      this.store.dispatch(startEdit({index}));
  }
}
