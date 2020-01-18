import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '', redirectTo: 'recipes', pathMatch: 'full'
  },
  {
      path: 'auth', loadChildren: './auth/auth.module#AuthModule'
  },
  {
      path: 'recipes', loadChildren: './recipes/recipies.module#RecipiesModule'
  },
  {
      path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
