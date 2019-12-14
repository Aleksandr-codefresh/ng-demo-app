import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) {}


    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const user = this.authService.lastUser;
        if (user) {
            const modifiedReq = req.clone({
                params: new HttpParams().set('auth', user.token)
            });

            return next.handle(modifiedReq);
        }

        return next.handle(req);
    }
}
