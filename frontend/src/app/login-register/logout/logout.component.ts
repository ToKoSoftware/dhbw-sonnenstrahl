import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly login: LoginService,
    private readonly router: Router
  ) {
  }

  /**
   * Logout and redirect to homepage page
   */
  ngOnInit(): void {
    this.login.logout();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

}
