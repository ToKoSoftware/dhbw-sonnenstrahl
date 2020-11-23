import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlanData} from '../../interfaces/plan.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {UiBreadcrumb, UiButtonGroup, UiButtonType} from '../../ui/ui.interface';
import {EstimatedUsageService} from '../../services/estimated-usage.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  public results: PlanData[] = [];
  public loading = false;
  public breadcrumbs: UiBreadcrumb[] = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '', title: 'Laden...'},
  ];
  public title = 'Suchergebnisse';
  public currentEstimatedUsage = 1000;
  public currentEstimatedUsageCount = 1;
  public plusMinusButtons: UiButtonGroup = {
    buttons: [
      {
        title: '-',
        function: () => {
          console.log('Minus');
          this.changeEstimatedUsagePersonCount(this.currentEstimatedUsageCount - 1);
        },
        type: UiButtonType.disabled
      },
      {
        title: `${this.currentEstimatedUsageCount} Personen`,
        type: UiButtonType.noAction,
      },
      {
        title: '+',
        function: () => {
          this.changeEstimatedUsagePersonCount(this.currentEstimatedUsageCount + 1);
        }
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private estimatedUsageService: EstimatedUsageService) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const postcode = params.get('postcode') || '';
      this.breadcrumbs[1].title = `Postleitzahl: ${postcode}`;
      this.breadcrumbs[1].routerLink = `/plans/${postcode}`;
      this.queryApi(postcode);
    });
  }

  private queryApi(query: string): void {
    this.loading = true;
    this.api.get<PlanData[]>('/plans', {
      postcode: query,
      order: '-cost_fix'
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
        this.title = `${data.data.length} Tarife für die Region ${query}`;
      }
    );
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public calculateCostExample(costVar: number, costFix: number): string {
    const cost = Math.floor(costVar / 10000 * this.currentEstimatedUsage) + (costFix / 10000);
    return this.roundToTwoDigits(cost);
  }

  public roundToTwoDigits(n: number): string {
    return (Math.round((n + Number.EPSILON) * 100) / 100).toString().replace('.', ',');
  }

  private changeEstimatedUsagePersonCount(count: number): void {
    this.currentEstimatedUsageCount = count;
    this.plusMinusButtons.buttons[1].title = `${this.currentEstimatedUsageCount} Personen`;
    const newEstimatedUsage = this.estimatedUsageService.getEstimatedUsage(count);
    this.currentEstimatedUsage = newEstimatedUsage || this.currentEstimatedUsage;
    this.plusMinusButtons.buttons[0].type = count - 1 === 0 ? UiButtonType.disabled : undefined;
  }
}
