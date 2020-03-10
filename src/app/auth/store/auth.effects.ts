import { AuthService } from './../auth.service';
import { User } from './../user.model';
import { HttpClient } from '@angular/common/http';
import {
    LOGIN_START,
    LoginStart,
    AUTHENTICATE_SUCCESS,
    SIGNUP_START,
    AuthenticateSuccess,
    AuthenticateFail,
    SignupStart,
    LOGOUT,
    AUTO_LOGIN
} from './auth.actions';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { IAuthResponseData } from '../auth.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { get } from 'lodash';


const handleAuthentication = (resData: IAuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthenticateSuccess({
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate
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
    return of(new AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$
        .pipe(
            ofType(SIGNUP_START),
            switchMap((signupAction: SignupStart) => {
                // tslint:disable-next-line:max-line-length
                return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
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
        );

    @Effect()
    authLogin = this.actions$
        .pipe(
            ofType(LOGIN_START),
            switchMap((authData: LoginStart) => {
                return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
                    ${environment.firebaseAPIKey}`, {
                        email: authData.payload.email,
                        password: authData.payload.password,
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
        );

    @Effect({ dispatch: false })
    authRedirect = this.actions$
        .pipe(
            ofType(
                AUTHENTICATE_SUCCESS
            ),
            tap(() => this.router.navigate(['/']))
        );


    @Effect({ dispatch: false })
    authLogout = this.actions$
        .pipe(
            ofType(LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        );

    @Effect()
    autoLogin = this.actions$
        .pipe(
            ofType(AUTO_LOGIN),
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
                        return new AuthenticateSuccess({
                            email: loadedUser.email,
                            userId: loadedUser.id,
                            token: loadedUser.token,
                            expirationDate: new Date(parsedUser.tokenExpirationDate)
                        });
                    }
                }

                return { type: 'DUMMY' };
            })
        );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private router: Router,
        private authService: AuthService
    ) {}
}
