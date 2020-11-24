import { Component, OnInit } from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api.service';
import {OrderData} from '../../interfaces/order.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public results: OrderData[] = [];
  public loading = false;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Tarife importieren',
        function: () => {
        },
        icon: 'upload-cloud'
      },
      {
        title: 'Tarife Exportieren',
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
    this.api.get<OrderData[]>('/plans').subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

}
