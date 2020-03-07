import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.store';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store<IAppState>
    ) {}


    // tslint:disable-next-line:max-line-length
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Observable<boolean | UrlTree> | Promise<boolean> | UrlTree {
        // return !!this.authService.lastUser || this.router.createUrlTree(['/auth']);
        return this.store.select('auth')
            .pipe(
                take(1),
                map((authState) => {
                    if (authState.user) {
                        return true;
                    }

                    return this.router.createUrlTree(['/auth']);
                })
            );
    }
}
