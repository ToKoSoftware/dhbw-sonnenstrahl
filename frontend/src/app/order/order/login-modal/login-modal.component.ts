import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
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

  public login(): void {
    this.error = false;
    this.loading = true;
    this.api.post<string>('/login', {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }).subscribe(
      data => {
        this.loginService.login(data.data);
        this.loading = false;
        this.modalService.close();
      }, error => {
        this.loading = false;
        this.error = true;
      }
    );
  }

  public closeModal(): void {
    this.modalService.close();
  }
}
