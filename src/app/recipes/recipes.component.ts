import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipieService } from './recipie.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  selectedRecipe: Recipe;
  constructor(private recipeService: RecipieService) { }

  ngOnInit() {
    this.recipeService.recipeSelected
      .subscribe((recipe: Recipe) => this.selectedRecipe = recipe);
  }

}
