import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


import { finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
        private authService: AuthService
    ) { }

    ngOnInit() { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.isLoading = true;
            const { email, password } = form.value;
            if (this.isLoginMode) {
                this.isLoading = false;
            } else {
                this.signup(email, password);
            }

            form.reset();
        }
    }

    private signup(email: string, password: string) {
        this.authService.signup(email, password)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(
                (response) => console.log(response),
                () => this.error = 'Error'
            );
    }
}
