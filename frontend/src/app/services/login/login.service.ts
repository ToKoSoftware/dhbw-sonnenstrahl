import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isLoggedIn$: ReplaySubject<boolean> = new ReplaySubject();
  public isAdmin$: ReplaySubject<boolean> = new ReplaySubject();
  public currentUser$: ReplaySubject<CurrentUser> = new ReplaySubject();
  public jwt$: ReplaySubject<string> = new ReplaySubject();

  constructor() {
    const jwt: string | null = localStorage.getItem('jwt');
    try {
      const decodedJWT = jwt_decode(jwt || '');
      this.isLoggedIn$.next(true);
      console.log(decodedJWT);
    } catch (error) {
      this.isLoggedIn$.next(false);
    }
  }

  public login(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    this.isLoggedIn$.next(true);
  }

  public logout(): void {
    localStorage.removeItem('jwt');
    this.isLoggedIn$.next(false);
  }
}

export interface CurrentUser {
  email: string;
  id: string;
  is_admin: boolean;
}
