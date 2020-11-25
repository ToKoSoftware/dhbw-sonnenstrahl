import { Component, OnInit } from '@angular/core';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api.service';
import {UserData} from '../../interfaces/user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public results: UserData[] = [];
  public loading = false;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Benutzerdaten exportieren',
        function: () => {
        },
        icon: 'download-cloud'
      }
    ]
  };

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.get<UserData[]>('/users', {
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

}
