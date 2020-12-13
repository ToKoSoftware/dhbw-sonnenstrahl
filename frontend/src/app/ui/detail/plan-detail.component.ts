import {Component, Input, OnInit} from '@angular/core';
import {PlanData} from '../../interfaces/plan.interface';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss']
})
export class PlanDetailComponent {
  @Input() plan: PlanData;
  @Input() estimatedUsage: number;
  constructor() { }

  public calculateCostExample(costVar: number, costFix: number): string {
    const cost = Math.floor(costVar / 10000 * this.estimatedUsage) + (costFix / 10000);
    return this.roundToTwoDigits(cost);
  }

  public roundToTwoDigits(n: number): string {
    return (Math.round((n + Number.EPSILON) * 100) / 100).toString().replace('.', ',');
  }


}
