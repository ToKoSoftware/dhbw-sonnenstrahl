import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {ConfirmModalService} from '../../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../../services/loading-modal/loading-modal.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit{
  public email: string;
  public password: string;
  public error: boolean;

  constructor(
    private router: Router,
    private readonly api: ApiService,
    private readonly loginService: LoginService,
    private readonly confirm: ConfirmModalService,
    private formBuilder: FormBuilder,
    private readonly loading: LoadingModalService) {
  }

  ngOnInit(): void {
  }

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
      }, error => {
        this.loading.hideLoading();
        this.error = true;
      }
    );
  }

}
