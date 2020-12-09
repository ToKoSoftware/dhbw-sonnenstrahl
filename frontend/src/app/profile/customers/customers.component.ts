import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserData} from '../../interfaces/user.interface';
import {ApiService} from '../../services/api/api.service';
import {LoginService} from '../../services/login/login.service';
import {profilePages} from '../profile.pages';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public profilePages = profilePages;
  public editUserForm: FormGroup;
  public loading = true;
  public currentUser: UserData;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private login: LoginService) {
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    this.api.get<UserData>(`/customers/?userId=${id}`).subscribe(
      (data) => {
        this.loading = false;
        this.currentUser = data.data;
        this.editUserForm = this.formBuilder.group(
          {
            email: [data.data.email],
            password: [''],
          }
        );
      }
    );
  }

  public updateUser(): void {
    this.api.post(`/users/`)
  }
}
