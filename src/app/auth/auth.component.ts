import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';


import { finalize } from 'rxjs/operators';
import { AuthService, IAuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss']
})

export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
    private closeSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver
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
                    (errorMessage) => {
                        this.error = errorMessage;
                        this.showErrorAlert(errorMessage);
                    }
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


    private showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = this.error;
        this.closeSubscription = componentRef.instance.close.subscribe(
            () => {
                this.closeSubscription.unsubscribe();
                hostViewContainerRef.clear();
                this.onHandleError();
            }
        );
    }


    ngOnDestroy() {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }
}
