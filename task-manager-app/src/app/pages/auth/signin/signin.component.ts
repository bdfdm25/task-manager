import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toggleForm } from '../store/auth.actions';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  showSignUp$ = this.store.select((state: any) => state.auth.showSignUp);

  authForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  constructor(private store: Store) {}

  toggleForm() {
    this.store.dispatch(toggleForm());
  }

  onLogin() {
    // const signin: ISignin = new User(
    //   this.authForm.value.username,
    //   this.authForm.value.password
    // );
    // this.authService.login(user).subscribe(
    //   (res: Session) => {
    //     console.log(res);
    //     this.authService.storeSessionData(res);
    //     this.router.navigate([Pages.HOME]);
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  }
}
