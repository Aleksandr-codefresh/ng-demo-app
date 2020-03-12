import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';
import { IAppState } from 'src/app/store/app.store';
import { Recipe } from '../recipe.model';
import { deleteRecipe } from '../store/recipe.actions';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe;
    id: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<IAppState>
    ) { }

    ngOnInit() {
        this.route.paramMap
            .pipe(
                map((params: Params) => params.get('id')),
                switchMap((id) => {
                    this.id = id;
                    return this.store.select('recipes');
                }),
                map((recipesState) => recipesState.recipes.find((recipe) => this.id === recipe.id))
            )
            .subscribe((recipe) => this.recipe = recipe);
    }

    onAddToShoppingList(): void {
        this.store.dispatch(addIngredients({ ingredients: this.recipe.ingredients }));
    }

    onDeleteRecipe(): void {
        this.store.dispatch(deleteRecipe({id: this.recipe.id}));
        this.store.select('recipes')
            .pipe(take(1))
            .subscribe(({recipes}) => {
                if (recipes.length > 0) {
                    this.router.navigate([recipes[0].id], { relativeTo: this.route.parent });
                } else {
                    this.router.navigate(['/recipes']);
                }
            });
    }
}
