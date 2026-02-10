import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleForm } from '../store/auth.actions';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { ISignup } from '../interfaces/signup.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnDestroy {
  private ngUnsubscribe$ = new Subject<boolean>();

  showSignUp$ = this.store.select((state: any) => state.auth.showSignUp);

  signupForm!: FormGroup;
  errMsg: string = '';
  loading: boolean = false;
  passwordStrength: 'weak' | 'medium' | 'strong' | null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
  ) {
    this.createForm();
    this.initPasswordStrengthCheck();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  toggleForm() {
    this.store.dispatch(toggleForm());
  }

  onSignup() {
    if (this.signupForm.valid) {
      const user: ISignup = this.signupForm.value;
      this.authService
        .signup(user)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => {
            console.error(err);
            this.errMsg = err.error.message;
            this.loading = false;
          },
          complete: () => {
            this.toggleForm();
            this.loading = false;
          },
        });
    } else {
      this.errMsg = 'Please fill in all fields correctly';
    }
  }

  private createForm() {
    this.signupForm = new FormGroup({
      fullname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  private initPasswordStrengthCheck(): void {
    this.signupForm
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((password: string) => {
        this.passwordStrength = this.calculatePasswordStrength(password);
      });
  }

  private calculatePasswordStrength(
    password: string,
  ): 'weak' | 'medium' | 'strong' | null {
    if (!password || password.length === 0) {
      return null;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password)) strength++; // lowercase
    if (/[A-Z]/.test(password)) strength++; // uppercase
    if (/[0-9]/.test(password)) strength++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength++; // special characters

    // Determine strength level
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }
}
