import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstimatedUsageService {
  public estimatedUsage$: BehaviorSubject<number | null> = new BehaviorSubject(1600);
  public estimatedPeople$: BehaviorSubject<number | null> = new BehaviorSubject(1);

  constructor() {
  }

  /**
   * Calculate estimated consumption from count of people
   * @param {number} peopleCount
   * @returns {number | null}
   */
  public getEstimatedUsage(peopleCount: number): number | null {
    if (peopleCount <= 0) {
      return null;
    }

    // source https://strom-report.de/stromverbrauch/
    switch (peopleCount) {
    case 1:
      return 1600;
    case 2:
      return 2400;
    case 3:
      return 3200;
    case 4:
      return 4000;
    case 5:
      return 4500;
    default:
      // use linear regression to estimate the usage
      return 1600 + peopleCount * 2900 / 5;
    }
  }

  /**
   * Calculate extimated count of people from consumption
   * @param usage
   * @returns {number}
   */
  public getEstimatedPeopleCount(usage: number): number {
    if (usage <= 1800) {
      return 1;
    } else if (usage <= 2600) {
      return 2;
    } else if (usage <= 3400) {
      return 3;
    } else if (usage <= 4200) {
      return 4;
    } else if (usage <= 4600) {
      return 5;
    } else {
      let calc = Math.ceil((usage - 1600) / (2900 / 5));
      calc = calc <= 0 ? 1 : calc;
      return calc;
    }

  }
}
