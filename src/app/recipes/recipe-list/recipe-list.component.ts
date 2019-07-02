import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipieService } from '../recipie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  private recipeChangeSubscription: Subscription;
  constructor(private recipieService: RecipieService) { }

  ngOnInit() {
    this.recipeChangeSubscription = this.recipieService.recipeChangedObservable
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
    this.recipes = this.recipieService.getRecipies();
  }

  ngOnDestroy(): void {
    this.recipeChangeSubscription.unsubscribe();
  }
}
