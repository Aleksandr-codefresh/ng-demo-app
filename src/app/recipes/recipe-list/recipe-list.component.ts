import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Subscription } from 'rxjs';
import { IAppState } from 'src/app/store/app.store';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
    recipes: Recipe[] = [];
    private recipeChangeSubscription: Subscription;
    constructor(
        private store: Store<IAppState>
    ) { }

    ngOnInit() {
        this.recipeChangeSubscription = this.store.select('recipes')
            .subscribe((recipesState) => {
                console.log(recipesState);
                this.recipes = recipesState.recipes;
            });
    }

    ngOnDestroy(): void {
        this.recipeChangeSubscription.unsubscribe();
    }
}
