import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
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

  constructor(private api: ApiService, private confirmService: ConfirmModalService) {
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
      this.loading = true;
      this.api.delete<PlanData[]>(`/plans/${plan.id}`).subscribe(
        data => {
          this.loading = false;
          this.results = data.data;
        }
      );
    }
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
