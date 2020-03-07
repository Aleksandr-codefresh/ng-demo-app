import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { IAppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { take, map, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private store: Store<IAppState>
    ) {}


    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth')
            .pipe(
                take(1),
                map((authState) => authState.user),
                exhaustMap((user) => {
                    if (user) {
                        const modifiedReq = req.clone({
                            params: new HttpParams().set('auth', user.token)
                        });

                        return next.handle(modifiedReq);
                    }

                    return next.handle(req);
                })
            );
    }
}
