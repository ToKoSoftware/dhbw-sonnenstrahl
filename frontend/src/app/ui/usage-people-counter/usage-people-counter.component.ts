import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UiButtonGroup, UiButtonType} from '../ui.interface';
import {EstimatedUsageService} from '../../services/estimated-usage/estimated-usage.service';

@Component({
  selector: 'app-usage-people-counter',
  templateUrl: './usage-people-counter.component.html',
  styleUrls: ['./usage-people-counter.component.scss'],
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
   * Reload buttons and shown data
   */
  private reloadButtons() {
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
   * Update estimated consumption and people
   */
  public updateUsageCount(): void {
    this.estimatedUsageService.estimatedUsage$.next(this.currentEstimatedUsage);
    this.estimatedUsageService.estimatedPeople$.next(this.currentEstimatedCount);
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
