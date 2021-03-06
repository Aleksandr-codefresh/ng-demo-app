import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from './../store/app.store';
import { logout } from './store/auth.actions';


export interface IAuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenExpirationTimer: any;

    constructor(
        private store: Store<IAppState>
    ) {}


    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(logout());
        }, expirationDuration);
    }


    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
