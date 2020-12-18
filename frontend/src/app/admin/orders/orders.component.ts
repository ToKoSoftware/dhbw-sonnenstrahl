import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {OrderData} from '../../interfaces/order.interface';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {ModalService} from '../../services/modal/modal.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('provisionModal', {static: true}) provisionModal: TemplateRef<unknown>;
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  public results: OrderData[] = [];
  public loading = false;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Provisionsberechnung',
        function: () => {
          this.modal.showModal(`Provisionen`, this.provisionModal);
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

  constructor(
    private api: ApiService,
    private modal: ModalService
    ) {
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

  public closeModal(): void {
    this.modal.close();
  }

}
