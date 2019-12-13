import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface IAuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
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
        return this.http.post<IAuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=', {
            email,
            password,
            returnSecureToken: true
        });
    }
}
