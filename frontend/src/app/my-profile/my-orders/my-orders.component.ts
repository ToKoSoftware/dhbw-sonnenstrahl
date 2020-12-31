import {Component, OnInit} from '@angular/core';
import {myProfileBreadcrumb, myProfilePages} from '../my-profile.pages';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {LoginService} from '../../services/login/login.service';
import {OrderData} from '../../interfaces/order.interface';
import {CustomerData} from '../../interfaces/customer.interface';

@Component({
  selector: 'app-edit',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
  public loading = true;
  public orders: OrderData[];

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private login: LoginService) {
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading = true;

    const id = this.login.decodedJwt$.value?.id || '';
    this.api.get<CustomerData[]>('/customers', {
      userId: id
    }).subscribe(
      data => {
        const ids = data.data.map(data => data.id);
        this.api.get<OrderData[]>(`/orders`, {
          sort: 'terminatedAt',
        }).subscribe(
          (data) => {
            this.loading = false;
            // fix admin being able to see all orders
            this.orders = data.data.filter(el => ids.includes(el.id));
          }
        );
      }
    );

  }

}
