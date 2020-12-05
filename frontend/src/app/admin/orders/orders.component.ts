import { Component, OnInit } from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {OrderData} from '../../interfaces/order.interface';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public sidebarPages = adminPages;
  public results: OrderData[] = [];
  public loading = false;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Provisionsberechnung',
        function: () => {
        },
        icon: 'bar-chart-2'
      },
      {
        title: 'Bestellungen Exportieren',
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
    this.api.get<OrderData[]>('/orders', {
      order: '-consumption'
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

}
