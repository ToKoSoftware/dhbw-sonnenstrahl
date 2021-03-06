import {Component} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public email: string;
  public password: string;
  public error: boolean;

  constructor(
    private loading: LoadingModalService,
    private loginService: LoginService,
    private router: Router,
    private api: ApiService) {
  }

  /**
   * Send user login data to server
   */
  public login(): void {
    this.error = false;
    this.loading.showLoading();
    this.api.post<string>('/login', {
      email: this.email,
      password: this.password,
    }).subscribe(
      data => {
        this.loginService.login(data.data);
        this.loading.hideLoading();
        this.router.navigate(['/']);
      }, error => {
        this.loading.hideLoading();
        this.error = true;
      }
    );
  }
}
