import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ISignin } from '@app/pages/auth/interfaces/signin.interface';
import { HttpClient } from '@angular/common/http';
import { Routes } from '@app/shared/helpers/routes.helper';
import { Observable } from 'rxjs';
import { ISignup } from '@app/pages/auth/interfaces/signup.interface';
import { jwtDecode } from 'jwt-decode';
import { IJwtPayload } from '@app/pages/auth/interfaces/jwt-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends SessionService {
  constructor(private http: HttpClient) {
    super();
  }

  public signin(signin: ISignin): Observable<any> {
    return this.http.post<any>(Routes.SIGNIN, signin);
  }

  public logout(): void {
    this.removeSessionData();
  }

  public signup(signup: ISignup): Observable<any> {
    return this.http.post<any>(Routes.SIGNUP, signup);
  }

  public storeSessionData(res: string): void {
    const payload: IJwtPayload = jwtDecode(res);
    this.setUserData(payload.fullname);
    this.setAccessToken(res);
    this.setExpirationDate(payload.exp.toString());
  }

  public isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
