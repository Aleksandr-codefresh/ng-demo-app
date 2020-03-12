import { FetchRecipes } from './../recipes/store/recipe.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { IAppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { Logout } from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    private userSub: Subscription;
    isAuthenticated = false;

    constructor(
        private dataStorageService: DataStorageService,
        private store: Store<IAppState>
    ) {}


    ngOnInit() {
        this.userSub = this.store.select('auth')
            .subscribe((authState) => this.isAuthenticated = !!authState.user);
    }

    onSaveData(): void {
        this.dataStorageService.storeRecipes();
    }

    onFetchData(): void {
        this.store.dispatch(new FetchRecipes());
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
