import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get access token from local storage', () => {
    localStorage.setItem('access_token', 'test_token');
    expect(service.getAccessToken()).toEqual('test_token');
  });

  it('should return empty string if access token is not found', () => {
    localStorage.removeItem('access_token');
    expect(service.getAccessToken()).toEqual('');
  });

  it('should check if expiration date is not expired', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours in the future
    expect(service.isExpired(futureDate)).toBe(false);
  });

  it('should check if expiration date is expired', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // 24 hours in the past
    expect(service.isExpired(pastDate)).toBe(true);
  });

  it('should set user data in local storage', () => {
    service.setUserData('test_user');
    expect(localStorage.getItem('user_data')).toEqual('test_user');
  });

  it('should get user data from local storage', () => {
    localStorage.setItem('user_data', 'test_user');
    expect(service.getUserData()).toEqual('test_user');
  });

  it('should return empty string if user data is not found', () => {
    localStorage.removeItem('user_data');
    expect(service.getUserData()).toEqual('');
  });

  it('should remove all session data from local storage', () => {
    localStorage.setItem('access_token', 'test_token');
    localStorage.setItem('user_data', 'test_user');
    service.removeSessionData();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('user_data')).toBeNull();
  });
});
