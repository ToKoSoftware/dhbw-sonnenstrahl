import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  @ViewChild('editModal', {static: true}) editModal: TemplateRef<unknown>;
  public results: PlanData[] = [];
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
          this.loadingService.hideLoading();
        }
      );
    }
  }

  public showEditModalForPlan(plan: PlanData): void {
    this.currentEditPlan = plan;
    this.modalService.showModal(this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }

  public saveEditedPlan(): void {
    this.modalService.close();
    this.loadingService.showLoading();
    this.api.put(`/plans/${this.currentEditPlan.id}`).subscribe();
    setTimeout(() => this.loadingService.hideLoading(), 4000);
  }

  private loadData(): void {
    this.loading = true;
    this.api.get<PlanData[]>('/plans', {
      order: '-cost_fix',
      is_active: 'true',
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }
}
