import { environment } from './../environments/environment';
import { AuthEffects } from './auth/store/auth.effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './header/header.component';
import { RecipiesModule } from './recipes/recipies.module';
import { SharedModule } from './shared/shared.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { appReducer } from './store/app.store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RecipeEffects } from './recipes/store/recipe.effects';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecipiesModule,
    ShoppingListModule,
    SharedModule,
    AuthModule,
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({
        logOnly: environment.production
    }),
    EffectsModule.forRoot([
        AuthEffects,
        RecipeEffects
    ]),
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
