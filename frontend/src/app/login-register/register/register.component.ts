import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private email: string;
  private password: string;

  constructor(
    private router: Router,
    private readonly api: ApiService,
    private readonly loginService: LoginService,
    private readonly loading: LoadingModalService) {
  }

  ngOnInit(): void {
  }

  public createUser(): void {
    this.api.post<UserData>('/user')
      .subscribe();
  }

  private login(): void {
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
      }
    );
  }
}
