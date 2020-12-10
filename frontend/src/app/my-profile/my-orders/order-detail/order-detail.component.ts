import {Component, Input, OnInit} from '@angular/core';
import {OrderData} from '../../../interfaces/order.interface';
import {ConfirmModalService} from '../../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../../services/modal/modal.service';
import {ApiService} from '../../../services/api/api.service';
import {PlanData} from '../../../interfaces/plan.interface';
import {CustomerData} from '../../../interfaces/customer.interface';
import {UserData} from '../../../interfaces/user.interface';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  @Input() order: OrderData;
  public plan: PlanData;
  public customer: CustomerData;
  public loadingPlan = true;
  public loadingCustomer = true;

  constructor(
    private api: ApiService,
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public async cancelOrder(): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass Sie den diesen Tarif kündigen möchten?`,
      description: 'Dies kann nicht rückgängig gemacht werden.'
    });
    if (confirmed) {
      this.loadingService.showLoading();
      this.api.put<{ success: boolean } | { success: boolean, error: string }>(`/orders/${this.order.id}/terminate`).subscribe(
        data => {
          this.order.terminatedAt = new Date().toISOString();
          this.loadingService.hideLoading();
        },
        error => {
          this.loadingService.hideLoading();
          this.confirmService.confirm({
            title: `Es ist ein Fehler beim Kündigen aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
    }
  }


  private loadData(): void {
    this.loadingCustomer = true;
    this.loadingPlan = true;
    this.api.get<PlanData>(`/plans/${this.order.planId}`).subscribe(
      data => {
        this.plan = data.data;
        this.loadingPlan = false;
      }
    );
    this.api.get<CustomerData>(`/customers/${this.order.customerId}`).subscribe(
      data => {
        this.customer = data.data;
        this.loadingCustomer = false;
      }
    );
  }
}
