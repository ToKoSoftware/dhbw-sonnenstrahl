import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OrderData} from '../../../interfaces/order.interface';
import {ApiService} from '../../../services/api/api.service';
import {CustomerData} from '../../../interfaces/customer.interface';
import {PlanData} from '../../../interfaces/plan.interface';
import {ConfirmModalService} from '../../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[orderTr]',
  templateUrl: './order-row.component.html',
  styleUrls: ['./order-row.component.scss']
})
export class OrderRowComponent implements OnInit {
  @Input() order: OrderData;
  @ViewChild('editModal', {static: true}) editModal: TemplateRef<unknown>;
  public loading = false;
  public currentEditOrder: OrderData;
  public customerData: CustomerData;
  public planData: PlanData;
  public loadingCustomer = true;
  public loadingPlan = true;

  constructor(
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.get<CustomerData>(`/customers/${this.order.customerId}`).subscribe(
      (data) => {
        this.loadingCustomer = false;
        this.customerData = data.data;
      }
    );
    this.api.get<PlanData>(`/plans/${this.order.planId}`).subscribe(
      (data) => {
        this.loadingPlan = false;
        this.planData = data.data;
      }
    );
  }


  public async showDeleteModalForOrder(order: OrderData): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass Sie diese Bestellung entfernen möchten?`,
      description: 'Dies kann nicht rückgängig gemacht werden.'
    });
    if (confirmed) {
      this.loadingService.showLoading();
      this.api.delete<{ success: boolean } | { success: boolean, error: string }>(`/orders/${order.id}`).subscribe(
        data => {
          window.location.reload();
        },
        error => {
          this.loadingService.hideLoading();
          this.confirmService.confirm({
            title: `Es ist ein Fehler beim Löschen aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
    }
  }

  public showEditModalForOrder(orderData: OrderData): void {
    this.currentEditOrder = {...orderData};
    this.modalService.showModal(`Bestellung bearbeiten`, this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }


  public saveEditedOrder(): void {
    this.modalService.close();
    this.loadingService.showLoading();
    this.api.put(`/orders/${this.currentEditOrder.id}`, {
      consumption: this.currentEditOrder.consumption.toString(),
      referrer: this.currentEditOrder.referrer,
    }).subscribe(
      data => {
        window.location.reload();
      }, error => {
        this.loadingService.hideLoading();
        this.confirmService.confirm({
          title: `Es ist ein Fehler beim Ändern aufgetreten.`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
          showCancelButton: false
        });
      }
    );
  }
}
