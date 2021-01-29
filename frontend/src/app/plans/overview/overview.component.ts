import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlanData} from '../../interfaces/plan.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {UiBreadcrumb} from '../../ui/ui.interface';
import {EstimatedUsageService} from '../../services/estimated-usage/estimated-usage.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class OverviewComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private usageSubscription: Subscription;
  public results: PlanDataWithCost[] = [];
  public loading = true;
  public breadcrumbs: UiBreadcrumb[] = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '', title: 'Laden...'},
  ];
  public title = 'Suchergebnisse';
  public currentEstimatedUsage = 1600;
  public currentEstimatedUsageCount = 1;

  constructor(
    private estimatedUsageService: EstimatedUsageService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const postcode = params.get('postcode') || '';
      this.breadcrumbs[1].title = `Postleitzahl: ${postcode}`;
      this.breadcrumbs[1].routerLink = `/plans/${postcode}`;
      this.queryApi(postcode);
    });

    this.usageSubscription = this.estimatedUsageService.estimatedUsage$.subscribe(u => {
      this.currentEstimatedUsage = u || 1;
      this.reorder();
    });
  }

  /**
   * Send GET request to api
   * @param {string} query
   */
  private queryApi(query: string): void {
    this.loading = true;
    this.api.get<PlanDataWithCost[]>('/plans', {
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

  /**
   * Sort plans by estimated costs
   */
  public reorder() {
    let items = this.results.map((res: PlanDataWithCost) => {
      res.costs = Math.floor(res.cost_var / 10000 * this.currentEstimatedUsage) + (res.cost_fix / 10000).toString();
      return res;
    });
    items.sort((a, b) => { return a.costs < b.costs? -1 : 1; });
    this.results = items;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.usageSubscription.unsubscribe();
  }

}

export type PlanDataWithCost = PlanData & { costs: string }
