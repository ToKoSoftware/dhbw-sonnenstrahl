import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {CustomerData} from '../../../interfaces/customer.interface';
import {ModalService} from '../../../services/modal/modal.service';
import {UserData} from '../../../interfaces/user.interface';

@Component({
  selector: 'app-related-customers',
  templateUrl: './related-customers.component.html',
  styleUrls: ['./related-customers.component.scss']
})
export class RelatedCustomersComponent implements OnInit {
  @Input() user: UserData;
  public loading = true;
  public results: CustomerData[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly modal: ModalService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.get<CustomerData[]>('/customers', {
      sort: '-lastName',
      userId: this.user.id
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  public closeModal(): void {
    this.modal.close();
  }

}
