import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {PlanData} from '../../interfaces/plan.interface';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  public results: PlanData[] = [];
  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.queryApi(params.get('query') || '');
    });
  }

  private queryApi(query: string): void {
    this.loading = true;
    this.api.get<PlanData[]>('/plans', {
      search: query
    }).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
