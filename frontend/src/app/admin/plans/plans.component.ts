import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  public sidebarPages = adminPages;
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
        title: 'Tarife Exportieren',
        function: () => {
        },
        icon: 'download-cloud'
      }
    ]
  };
  public currentEditPlan: PlanData;

  constructor(private api: ApiService,
              private confirmService: ConfirmModalService,
              private loadingService: LoadingModalService,
              private modalService: ModalService) {
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  public async showDeleteModalForPlan(plan: PlanData): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass sie den Tarif "${plan.plan} (${plan.postcode})" entfernen möchten?`,
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
      Tarifname: this.currentEditPlan.plan,
      Fixkosten: this.currentEditPlan.cost_fix.toString(),
      PLZ: this.currentEditPlan.postcode,
      VariableKosten: this.currentEditPlan.cost_var.toString(),
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
