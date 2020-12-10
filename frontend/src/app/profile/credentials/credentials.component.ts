import {Component, OnInit} from '@angular/core';
import {profilePages} from '../profile.pages';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {LoginService} from '../../services/login/login.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  public profilePages = profilePages;
  public editUserForm: FormGroup;
  public loading = true;
  public currentUser: UserData;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private loadingModalService: LoadingModalService,
    private login: LoginService) {
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    this.api.get<UserData>(`/users/${id}`).subscribe(
      (data) => {
        this.loading = false;
        this.currentUser = data.data;
        this.editUserForm = this.formBuilder.group(
          {
            email: [data.data.email],
            currentPassword: [''],
            password: [''],
          }
        );
      }
    );
  }

  public updateUserPassword(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    const password = this.editUserForm.value.password;
    this.api.put<UserData>(
      `/users/${id}`,
      {password}).subscribe(
      data => {
        this.currentUser = data.data;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public updateEmail(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    const email = this.editUserForm.value.email;
    this.api.put<UserData>(
      `/users/${id}`,
      {email})
      .subscribe(
        data => {
          this.loading = false;
          this.currentUser = data.data;
        },
        error => {
          this.loading = false;
        }
      );
  }

}
