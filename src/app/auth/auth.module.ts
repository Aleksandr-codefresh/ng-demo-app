import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';


@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([{
            path: 'auth', component: AuthComponent
        }])
    ],
    declarations: [
        AuthComponent
    ],
    providers: [],
})
export class AuthModule { }
