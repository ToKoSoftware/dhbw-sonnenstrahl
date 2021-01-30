import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../../services/api/api.service';
import {PlanData} from '../../interfaces/plan.interface';
import {UiBreadcrumb} from '../../ui/ui.interface';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  public results: PlanData[] = [];
  public loading = false;
  public breadcrumbs: UiBreadcrumb[] = [
    {
      routerLink: '/',
      title: 'Start'
    }, {
      routerLink: '/',
      title: 'Tarif Suchen'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.queryApi(params.get('query') || '');
    });
  }

  /**
   * Send GET request to api
   * @param {string} query
   */
  private queryApi(query: string): void {
    this.loading = true;
    this.api.get<PlanData[]>('/plans', {
      postcode: query
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  /**
   * Parse string from JSON of plans
   * @param {PlanData} plan 
   */
  public replaceText(plan: PlanData): string {
    return JSON.stringify(plan);
  }
}
