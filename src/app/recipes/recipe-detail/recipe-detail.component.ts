import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipieService } from '../recipie.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(private recipeService: RecipieService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe((params: Params) => {
        const recipeId = params.get('id');
        this.recipe = this.recipeService.getRecipeBuId(recipeId);
      });
  }

  onAddToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDeleteRecipe(): void {
    this.recipeService.deleteRecipe(this.recipe.id);
    const recipes = this.recipeService.getRecipies();
    if (recipes.length > 0) {
      this.router.navigate([recipes[0].id], { relativeTo: this.route.parent });
    } else {
      this.router.navigate(['/recipes']);
    }
  }
}
