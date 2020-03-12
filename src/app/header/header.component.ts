import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Logout } from '../auth/store/auth.actions';
import { IAppState } from '../store/app.store';
import { fetchRecipes, storeRecipes } from './../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    private userSub: Subscription;
    isAuthenticated = false;

    constructor(
        private store: Store<IAppState>
    ) {}


    ngOnInit() {
        this.userSub = this.store.select('auth')
            .subscribe((authState) => this.isAuthenticated = !!authState.user);
    }

    onSaveData(): void {
        this.store.dispatch(storeRecipes());
    }

    onFetchData(): void {
        this.store.dispatch(fetchRecipes());
    }


    onLogout() {
        this.store.dispatch(new Logout());
    }


    ngOnDestroy() {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
    }
}
