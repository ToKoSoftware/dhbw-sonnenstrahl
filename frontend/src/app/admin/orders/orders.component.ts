import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {OrderData} from '../../interfaces/order.interface';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {ModalService} from '../../services/modal/modal.service';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public currentLimitAndOffset = {limit: 25, offset: 0};
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
          const jwt = this.login.jwt$.value;
          window.open(`/api/v1/admin/export/orders?token=${jwt}`, '_blank');
        },
        icon: 'download-cloud'
      }
    ]
  };

  constructor(
    private api: ApiService,
    private login: LoginService,
    private modal: ModalService
    ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(filter: { [k: string]: string | number } = {
    sort: '-consumption',
  }): void {
    this.loading = true;
    filter = {
      ...filter,
      ...this.currentLimitAndOffset
    };
    this.api.get<OrderData[]>('/orders', filter).subscribe(
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
