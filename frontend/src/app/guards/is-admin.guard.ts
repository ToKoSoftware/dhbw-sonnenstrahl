import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate, CanActivateChild {

  constructor(private readonly login: LoginService,
              private readonly router: Router) {
  }

  /**
   * Prevent non admin users from opening admin pages
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.login.isAdmin$.getValue() ? this.login.isAdmin$.getValue() : this.get404Tree();
  }

  /**
   * Prevent non admin users from opening admin pages
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state);
  }

  protected get404Tree(): UrlTree {
    return this.router.parseUrl('**');
  }

}
