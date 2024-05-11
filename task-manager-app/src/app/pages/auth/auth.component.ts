import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleForm } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  showSignUp$ = this.store.select((state: any) => state.auth.showSignUp);

  constructor(private store: Store) {}

  toggleForm() {
    this.store.dispatch(toggleForm());
  }
}
