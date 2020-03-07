import { HttpClient } from '@angular/common/http';
import { LOGIN_START, LoginStart, Login, LOGIN, LoginFail } from './auth.actions';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { IAuthResponseData } from '../auth.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { get } from 'lodash';


@Injectable()
export class AuthEffects {
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
                        map((resData) => {
                            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                            return new Login({
                                email: resData.email,
                                userId: resData.localId,
                                token: resData.idToken,
                                expirationDate
                            });
                        }),
                        catchError((errorRes) => {
                            let errorMessage = 'An unknown error occured!';
                            switch (get(errorRes, 'error.error.errors[0].message')) {
                                case 'INVALID_PASSWORD':
                                    errorMessage = 'This password is not correct.';
                                    break;
                                case 'EMAIL_NOT_FOUND':
                                    errorMessage = 'This email does not exist';
                            }
                            return of(new LoginFail(errorMessage));
                        })
                    );
            })
        );

    @Effect({ dispatch: false })
    authSuccess = this.actions$
        .pipe(
            ofType(LOGIN),
            tap(() => this.router.navigate(['/']))
        );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private router: Router
    ) {}
}
