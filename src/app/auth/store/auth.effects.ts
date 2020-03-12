import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { get } from 'lodash';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAuthResponseData } from '../auth.service';
import { AuthService } from './../auth.service';
import { User } from './../user.model';
import {

    signupStart,
    authenticateSuccess,
    authenticateFail,
    loginStart,
    logout,
    autoLogin} from './auth.actions';


const handleAuthentication = (resData: IAuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return authenticateSuccess({
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate,
        redirect: true
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occured!';
    switch (get(errorRes, 'error.error.errors[0].message')) {
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist';
    }
    return of(authenticateFail({errorMessage}));
};

@Injectable()
export class AuthEffects {
    authSignup = createEffect(() => this.actions$
        .pipe(
            ofType(signupStart),
            switchMap((signupAction) => {
                // tslint:disable-next-line:max-line-length
                return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
                        email: signupAction.email,
                        password: signupAction.password,
                        returnSecureToken: true
                    })
                    .pipe(
                        tap((resData) => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(handleAuthentication),
                        catchError(handleError)
                    );
            })
        )
    );


    authLogin = createEffect(() => this.actions$
        .pipe(
            ofType(loginStart),
            switchMap((authData) => {
                return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
                    ${environment.firebaseAPIKey}`, {
                        email: authData.email,
                        password: authData.password,
                        returnSecureToken: true
                    })
                    .pipe(
                        tap((resData) => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(handleAuthentication),
                        catchError(handleError)
                    );
            })
        )
    );


    authRedirect = createEffect(() => this.actions$
        .pipe(
            ofType(authenticateSuccess),
            tap((authSuccessAction) => {
                if (authSuccessAction.redirect) {
                    this.router.navigate(['/']);
                }
            })
        ),
        { dispatch: false }
    );


    authLogout = createEffect(() => this.actions$
        .pipe(
            ofType(logout),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        ),
        { dispatch: false }
    );


    autoLogin = createEffect(() => this.actions$
        .pipe(
            ofType(autoLogin),
            map(() => {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    const loadedUser = new User(
                        parsedUser.email,
                        parsedUser.id,
                        parsedUser.pToken,
                        new Date(parsedUser.tokenExpirationDate)
                    );

                    if (loadedUser.token) {
                        const expirationDuration = new Date(parsedUser.tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setLogoutTimer(expirationDuration);
                        return authenticateSuccess({
                            email: loadedUser.email,
                            userId: loadedUser.id,
                            token: loadedUser.token,
                            expirationDate: new Date(parsedUser.tokenExpirationDate),
                            redirect: false
                        });
                    }
                }

                return { type: 'DUMMY' };
            })
        )
    );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private router: Router,
        private authService: AuthService
    ) {}
}
