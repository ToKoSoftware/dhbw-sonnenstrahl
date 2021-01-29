import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {LoginService} from '../../services/login/login.service';
import {AvailableFilter, FilterValue} from '../../ui/filter/filter.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  public currentLimitAndOffset = {limit: 50, offset: 0};
  public filterCount = 0;
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
      }
    ]
  };
  public currentEditPlan: PlanData;
  public filters: AvailableFilter[] = [{
    title: 'Titel',
    name: 'plan',
  }, {
    title: 'Postleitzahl',
    name: 'postcode',
  }, {
    title: 'ID',
    name: 'id',
  }];

  constructor(private api: ApiService,
              private login: LoginService,
              private confirmService: ConfirmModalService,
              private loadingService: LoadingModalService,
              private modalService: ModalService) {
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  /**
   * Show a delete modal
   * @param plan the plan that should be delted
   */
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

  /**
   * Apply a filter
   * @param filterValue
   */
  public applyFilter(filterValue: FilterValue[]): void {
    const f: { [k: string]: string | number } = {
      order: '-postcode',
      is_active: 'true',
    };
    this.currentLimitAndOffset.offset = 0;
    filterValue.forEach(val => {
      f[val.name] = val.value;
    });
    this.filterCount = filterValue.length;
    this.loadData(f);
  }

  /**
   * Show an modal
   * @param plan the plan that should be added
   */
  public showEditModalForPlan(plan: PlanData): void {
    this.currentEditPlan = {...plan}; // copy the arrays data
    this.modalService.showModal(`"${plan.plan} (${plan.postcode})" bearbeiten`, this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }

  /**
   * Save the current plan
   */
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

  /**
   * Get data from server
   */
  public loadData(filter: { [k: string]: string | number } = {
    order: '-postcode',
    is_active: 'true',
  }): void {
    this.loading = true;
    filter = {
      ...filter,
      order: '-postcode',
      is_active: 'true',
      ...this.currentLimitAndOffset
    };
    this.api.get<PlanData[]>('/plans', filter).subscribe(
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
