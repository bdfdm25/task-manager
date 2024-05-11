import { Injectable } from '@angular/core';
import Keys from '@app/shared/helpers/storage-keys';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  public getAccessToken(): string {
    return localStorage.getItem(Keys.ACCESS_TOKEN) ?? '';
  }

  public isExpired(expDate: Date): boolean {
    return expDate > new Date();
  }

  public setUserData(username: string): void {
    localStorage.setItem(Keys.USER_DATA, username);
  }

  public getUserData(): string {
    return localStorage.getItem(Keys.USER_DATA) ?? '';
  }

  public removeSessionData(): void {
    localStorage.clear();
  }
}
