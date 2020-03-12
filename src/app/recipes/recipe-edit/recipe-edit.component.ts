import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAppState } from 'src/app/store/app.store';
import uuid4 from 'uuid4';
import { Recipe } from '../recipe.model';
import { UpdateRecipe } from '../store/recipe.actions';
import { AddRecipe } from './../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    id: string;
    editMode = false;
    recipeForm: FormGroup;
    private editSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<IAppState>
    ) { }

    ngOnInit() {
        this.route.paramMap
            .subscribe((params: Params) => {
            this.id = params.get('id');
            this.editMode = this.id !== null;
            this.InitForm();
            });
    }

    private InitForm(): void {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        const recipeIngredients = new FormArray([]);

        if (this.editMode) {
            this.editSub = this.store.select('recipes')
                .pipe(
                    map((recipesState) => recipesState.recipes.find((rec) => this.id === rec.id))
                )
                .subscribe((recipe) => {
                    recipeName = recipe.name;
                    recipeImagePath = recipe.imagePath;
                    recipeDescription = recipe.description;
                    if (recipe.ingredients) {
                        for (const ingredient of recipe.ingredients) {
                            recipeIngredients.push(
                            new FormGroup({
                                name: new FormControl(ingredient.name, Validators.required),
                                amount: new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/)
                                ])
                            })
                            );
                        }
                    }
                });
        }

        this.recipeForm = new FormGroup({
            name: new FormControl(recipeName, Validators.required),
            imagePath: new FormControl(recipeImagePath, Validators.required),
            description: new FormControl(recipeDescription, Validators.required),
            ingredients: recipeIngredients
        });
    }

    getControls(): AbstractControl[] {
        return (this.recipeForm.get('ingredients') as FormArray).controls;
    }

    onSubmit() {
        const recipeId = this.editMode ? this.id : uuid4();
        const newRecipe = new Recipe(
            this.recipeForm.value.name,
            this.recipeForm.value.description,
            this.recipeForm.value.imagePath,
            this.recipeForm.value.ingredients,
            recipeId
        );
        if (this.editMode) {
            this.store.dispatch(new UpdateRecipe({ id: this.id, newRecipe }));
        } else {
            this.store.dispatch(new AddRecipe(newRecipe));
        }
        this.onCancel();
    }

    onAddIngredient() {
        (this.recipeForm.get('ingredients') as FormArray).push(
            new FormGroup({
            name: new FormControl(null, Validators.required),
            amount: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
            ])
            })
        );
    }

    onCancel(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    onDeleteIngredient(index: number): void {
        (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
    }


    ngOnDestroy() {
        if (this.editSub) {
            this.editSub.unsubscribe();
        }
    }
}
