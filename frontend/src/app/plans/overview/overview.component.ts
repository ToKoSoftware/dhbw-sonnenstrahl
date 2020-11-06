import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlanData} from '../../interfaces/plan.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {UiBreadcrumb} from '../../ui/ui.interface';

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
  public guessedUsage = 1000;

  constructor(
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
    const cost = Math.floor(costVar / 10000 * this.guessedUsage) + (costFix / 10000);
    return this.roundToTwoDigits(cost);
  }

  public roundToTwoDigits(n: number): string {
    return (Math.round((n + Number.EPSILON) * 100) / 100).toString().replace('.', ',');
  }
}
