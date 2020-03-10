import { AutoLogin } from './auth/store/auth.actions';
import { Component, OnInit } from '@angular/core';
import { IAppState } from './store/app.store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
      private store: Store<IAppState>
  ) {}


  ngOnInit() {
      this.store.dispatch(new AutoLogin());
  }
}
