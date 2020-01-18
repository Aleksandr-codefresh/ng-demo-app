import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '', redirectTo: 'recipes', pathMatch: 'full'
  },
  {
      path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
      path: 'recipes', loadChildren: () => import('./recipes/recipies.module').then(m => m.RecipiesModule)
  },
  {
      path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
