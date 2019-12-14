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


const API_KEY = '';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user = new BehaviorSubject<User>(null);

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
        return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
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


    login(email: string, password: string): Observable<IAuthResponseData> {
        return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
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
        this.router.navigate(['/auth']);
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
    }
}
