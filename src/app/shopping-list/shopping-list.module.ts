import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        ShoppingListRoutingModule
    ],
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    providers: [],
})
export class ShoppingListModule { }
