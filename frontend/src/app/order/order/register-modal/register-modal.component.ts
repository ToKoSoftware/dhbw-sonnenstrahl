import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api/api.service';
import {LoginService} from '../../../services/login/login.service';
import {ModalService} from '../../../services/modal/modal.service';
import {UserData} from '../../../interfaces/user.interface';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html'
})
export class RegisterModalComponent implements OnInit {

  public error: boolean;
  public loading: boolean;
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private readonly api: ApiService,
    private readonly loginService: LoginService,
    private readonly modalService: ModalService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: [''],
        password: [''],
      }
    );
  }

  /**
   * Register user
   */
  public register(): void {
    this.api.post<UserData>('/users',
      {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
    ).subscribe(
      (data) => {
        this.login();
      }, error => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  /**
   * Login user after successful registration
   */
  private login(): void {
    this.loading = true;
    this.api.post<string>('/login', {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }).subscribe(
      data => {
        this.loginService.login(data.data);
        this.modalService.close();
      }, error => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  public closeModal(): void {
    this.modalService.close();
  }

}
