import { LoginStart, SignupStart, ClearError } from './store/auth.actions';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';


import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { IAppState } from '../store/app.store';
import { Store } from '@ngrx/store';

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
    private storeSubscription: Subscription;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<IAppState>
    ) { }

    ngOnInit() {
        this.storeSubscription = this.store.select('auth')
            .subscribe((authState) => {
                this.isLoading = authState.loading;
                this.error = authState.authError;
                if (this.error) {
                    this.showErrorAlert(this.error);
                }
            });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            const { email, password } = form.value;
            if (this.isLoginMode) {
                this.store.dispatch(new LoginStart({
                    email,
                    password
                }));
            } else {
                this.store.dispatch(new SignupStart({ email, password }));
            }

            form.reset();
        }
    }


    onHandleError() {
        this.store.dispatch(new ClearError());
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

        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
}
