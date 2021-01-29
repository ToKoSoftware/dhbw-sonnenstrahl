import {Component, Input} from '@angular/core';
import {PlanData} from '../../interfaces/plan.interface';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss']
})
export class PlanDetailComponent {
  @Input() plan: PlanData;
  @Input() estimatedUsage: number;

  constructor() {
  }

  /**
   * Calculates estimated costs from variable and fix costs
   * @param {number} costVar 
   * @param {number} costFix 
   * @returns {string}
   */
  public calculateCostExample(costVar: number, costFix: number): string {
    const cost = (costVar * this.estimatedUsage) + costFix;
    return PlanDetailComponent.convertToRealValue(cost);
  }

  private static convertToRealValue(number: number): string {
    // 5156200 -> 515.62
    // remove 00 at the end -> 51562
    let converted = number.toString().slice(0, -2);
    // get last 2 characters and add comma -> ,62
    let decimal = ',' + converted.slice(-2);
    // remove 62 at the end of original -> 515
    converted = converted.slice(0, -2);
    // return 515,62
    return converted + decimal;
  }

  /**
   * Round number to two digits
   * @param {number} n
   */
  public roundToTwoDigits(n: number): string {
    return (Math.round((n + Number.EPSILON) * 100) / 100).toString().replace('.', ',');
  }


}
