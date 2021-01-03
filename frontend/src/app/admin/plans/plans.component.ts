import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  @ViewChild('editModal', {static: true}) editModal: TemplateRef<unknown>;
  @ViewChild('importPlansModal', {static: true}) importPlansModal: TemplateRef<unknown>;
  public results: PlanData[] = [];
  public loading = false;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Tarife importieren',
        function: () => {
          this.showImportPlansModal();
        },
        icon: 'upload-cloud'
      },
      {
        title: 'Tarife exportieren',
        function: () => {
          const jwt = this.login.jwt$.value;
          window.open(`/api/v1/export/orders?token=${jwt}`, '_blank');
        },
        icon: 'download-cloud'
      }
    ]
  };
  public currentEditPlan: PlanData;

  constructor(private api: ApiService,
              private login: LoginService,
              private confirmService: ConfirmModalService,
              private loadingService: LoadingModalService,
              private modalService: ModalService) {
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  public async showDeleteModalForPlan(plan: PlanData): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass Sie den Tarif "${plan.plan} (${plan.postcode})" entfernen möchten?`,
      description: 'Der Tarif wird dabei lediglich auf "inaktiv" gesetzt.'
    });
    if (confirmed) {
      this.loadingService.showLoading();
      this.api.delete<{ success: boolean } | { success: boolean, error: string }>(`/plans/${plan.id}`).subscribe(
        data => {
          this.loadData();
          this.loadingService.hideLoading();
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

  public showEditModalForPlan(plan: PlanData): void {
    this.currentEditPlan = {...plan};
    this.modalService.showModal(`"${plan.plan} (${plan.postcode})" bearbeiten`, this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }

  public saveEditedPlan(): void {
    this.modalService.close();
    this.loadingService.showLoading();
    this.api.put(`/plans/${this.currentEditPlan.id}`, {
      plan: this.currentEditPlan.plan,
      cost_fix: this.currentEditPlan.cost_fix.toString(),
      postcode: this.currentEditPlan.postcode,
      cost_var: this.currentEditPlan.cost_var.toString(),
    }).subscribe(
      data => {
        this.loadingService.hideLoading();
        this.loadData();
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

  private loadData(): void {
    this.loading = true;
    this.api.get<PlanData[]>('/plans', {
      order: '-postcode',
      is_active: 'true',
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  public showImportPlansModal(): void {
    this.modalService.showModal(`Tarife importieren`, this.importPlansModal);
  }
}
