import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleForm } from '../store/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  showSignUp$ = this.store.select((state: any) => state.auth.showSignUp);

  constructor(private store: Store) {}

  toggleForm() {
    this.store.dispatch(toggleForm());
  }
}
