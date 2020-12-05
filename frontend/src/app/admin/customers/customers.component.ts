import { Component, OnInit } from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-users',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public sidebarPages = adminPages;
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
