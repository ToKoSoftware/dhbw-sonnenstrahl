import {Component, OnInit} from '@angular/core';
import {profilePages} from '../profile.pages';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
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
