import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {CustomerData} from '../../../interfaces/customer.interface';
import {LoginService} from '../../../services/login/login.service';
import {OrderService} from '../../../services/order/order.service';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-select-customer-modal',
  templateUrl: './select-customer-modal.component.html',
  styleUrls: ['./select-customer-modal.component.scss']
})
export class SelectCustomerModalComponent implements OnInit {
  public loading = true;
  public customers: CustomerData[] = [];

  constructor(
    private login: LoginService,
    private modal: ModalService,
    public orderService: OrderService,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.get<CustomerData[]>('/customers', {
      userId: this.login.decodedJwt$.value?.id // fix admin being able to see all customers
    }).subscribe(
      data => {
        this.loading = false;
        this.customers = data.data;
      }
    );
  }

  /**
   * Select customer
   * @param {CustomerData | null} customer
   */
  public selectCustomer(customer: CustomerData | null): void {
    this.orderService.selectedCustomer$.next(customer);
    this.modal.close();
  }

}
