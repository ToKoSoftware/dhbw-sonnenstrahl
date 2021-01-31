import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UiButtonGroup, UiButtonType} from '../ui.interface';
import {EstimatedUsageService} from '../../services/estimated-usage/estimated-usage.service';

@Component({
  selector: 'app-usage-people-counter',
  templateUrl: './usage-people-counter.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class UsagePeopleCounterComponent implements OnInit, OnChanges {
  get currentEstimatedCount(): number {
    return this.estimatedUsageService.getEstimatedPeopleCount(this.currentEstimatedUsage)
  }

  @Input() public currentEstimatedUsage = 1600;
  public plusMinusButtons: UiButtonGroup;

  constructor(
    private estimatedUsageService: EstimatedUsageService) {
  }

  ngOnInit(): void {
    this.reloadButtons();
  }

  /**
   * Update estimated consumption and people
   */
  public updateUsageCount(): void {
    // don't let the user enter negative values
    if (this.currentEstimatedUsage < 0 || isNaN(this.currentEstimatedUsage)) {
      this.currentEstimatedUsage = 1600;
    } else if (this.currentEstimatedUsage > 20160) {
      // don't let the user enter a value that causes an overflow
      this.currentEstimatedUsage = 20160;
    }
    this.estimatedUsageService.estimatedUsage$.next(this.currentEstimatedUsage);
    this.estimatedUsageService.estimatedPeople$.next(this.currentEstimatedCount);
  }

  /**
   * Reload buttons and shown data
   */
  private reloadButtons(): void {
    this.plusMinusButtons = {
      buttons: [
        {
          title: '-',
          function: () => {
            this.changeEstimatedUsagePersonCount(this.currentEstimatedCount - 1);
          },
          type: this.currentEstimatedCount <= 1 ? UiButtonType.disabled : undefined,
        },
        {
          title: `${this.currentEstimatedCount} Personen`,
          type: UiButtonType.noAction,
        },
        {
          title: '+',
          function: () => {
            this.changeEstimatedUsagePersonCount(this.currentEstimatedCount + 1);
          }
        }
      ]
    };
  }

  /**
   * Calculate consumption from new people count
   *
   * @param {number} count
   */
  private changeEstimatedUsagePersonCount(count: number): void {
    const newEstimatedUsage = this.estimatedUsageService.getEstimatedUsage(count);
    this.currentEstimatedUsage = newEstimatedUsage || this.currentEstimatedUsage;
    this.plusMinusButtons.buttons[1].title = `${this.currentEstimatedCount} Personen`;
    this.updateUsageCount();
    this.reloadButtons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadButtons();
    this.updateUsageCount();
  }

}
