import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { get } from 'lodash';


interface IAuthResponseData {
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
    constructor(
        private http: HttpClient
    ) {}

    signup(email: string, password: string): Observable<IAuthResponseData> {
        // tslint:disable-next-line:max-line-length
        return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
            email,
            password,
            returnSecureToken: true
        })
        .pipe(catchError((errorResponse) => {
            let errorMessage = 'An unknown error occured!';
            switch (get(errorResponse, 'error.error.message')) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exists already.';
            }

            return throwError(errorMessage);
        }));
    }


    login(email: string, password: string): Observable<IAuthResponseData> {
        return this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(catchError((errorResponse) => {
                let errorMessage = 'An unknown error occured!';
                switch (get(errorResponse, 'error.error.errors[0].message')) {
                    case 'INVALID_PASSWORD':
                        errorMessage = 'This password is not correct.';
                        break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = 'This email does not exist';
                }

                return throwError(errorMessage);
            }));
    }
}
