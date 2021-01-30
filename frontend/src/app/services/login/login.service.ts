import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import jwt_decode from 'jwt-decode';
import {ApiService} from '../api/api.service';
import {UserData} from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public jwt$: BehaviorSubject<string |null> = new BehaviorSubject(null);
  public decodedJwt$: BehaviorSubject<JWT |null> = new BehaviorSubject(null);

  constructor() {
    this.reloadJWT();
  }

  /**
   * Set JWT to local storage and reload JWT
   * @param {string} jwt
   */
  public login(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    this.reloadJWT();
  }

  /**
   * Remove JWT from local storage and reload JWT
   */
  public logout(): void {
    localStorage.removeItem('jwt');
    this.reloadJWT();
  }

  /**
   * Reload JWT
   *  - decode existing JWT
   *  - set new expiration date
   *  - create new JWT
   */
  private reloadJWT(): void {
    const jwt: string | null = localStorage.getItem('jwt');
    try {
      const decodedJWT = jwt_decode<JWT>(jwt || '');
      const now = new Date();
      const expiration = new Date(decodedJWT.exp * 1000);
      this.isLoggedIn$.next(expiration > now);
      this.jwt$.next(jwt);
      this.decodedJwt$.next(decodedJWT);
      this.isAdmin$.next(decodedJWT.is_admin);
    } catch (error) {
      this.isLoggedIn$.next(false);
      this.isAdmin$.next(false);
      this.jwt$.next(null);
      this.decodedJwt$.next(null);
    }
  }

}

export interface JWT {
  email: string;
  id: string;
  is_admin: boolean;
  iat: number;
  exp: number;
}
