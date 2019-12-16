import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


import { finalize } from 'rxjs/operators';
import { AuthService, IAuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss']
})

export class AuthComponent implements OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.isLoading = true;
            const { email, password } = form.value;
            let authObs: Observable<IAuthResponseData>;
            if (this.isLoginMode) {
                authObs = this.login(email, password);
            } else {
                authObs = this.signup(email, password);
            }

            authObs.pipe(finalize(() => this.isLoading = false))
                .subscribe(
                    (response) => {
                        this.router.navigate(['/recipes']);
                    },
                    (errorMessage) => this.error = errorMessage
                );

            form.reset();
        }
    }

    private signup(email: string, password: string) {
        return this.authService.signup(email, password);
    }


    private login(email: string, password: string) {
        return this.authService.login(email, password);
    }


    onHandleError() {
        this.error = null;
    }
}
