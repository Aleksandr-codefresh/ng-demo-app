import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { get } from 'lodash';
import { User } from './user.model';
import { Router } from '@angular/router';


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
    private user = new BehaviorSubject<User>(null);
    private tokenExpirationTimeout: any;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    get userObservable(): Observable<User> {
        return this.user.asObservable();
    }

    get lastUser(): User {
        return this.user.value;
    }

    signup(email: string, password: string): Observable<IAuthResponseData> {
        // tslint:disable-next-line:max-line-length
        return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
            email,
            password,
            returnSecureToken: true
        })
        .pipe(
            catchError((errorResponse) => {
                let errorMessage = 'An unknown error occured!';
                switch (get(errorResponse, 'error.error.message')) {
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email exists already.';
                }

                return throwError(errorMessage);
            }),
            tap((res) => this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn))
        );
    }


    autoLogin() {
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
                this.user.next(loadedUser);
                const expirationDuration = new Date(parsedUser.tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expirationDuration);
            }
        }
    }


    login(email: string, password: string): Observable<IAuthResponseData> {
        return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
            ${environment.firebaseAPIKey}`, {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(
                catchError((errorResponse) => {
                    let errorMessage = 'An unknown error occured!';
                    switch (get(errorResponse, 'error.error.errors[0].message')) {
                        case 'INVALID_PASSWORD':
                            errorMessage = 'This password is not correct.';
                            break;
                        case 'EMAIL_NOT_FOUND':
                            errorMessage = 'This email does not exist';
                    }

                    return throwError(errorMessage);
                }),
                tap((res) => this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn))
            );
    }


    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);

        if (this.tokenExpirationTimeout) {
            clearTimeout(this.tokenExpirationTimeout);
        }
        this.tokenExpirationTimeout = null;
    }


    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimeout = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }


    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expitationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            userId,
            token,
            expitationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}
