import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UiButtonGroup, UiButtonType} from '../ui.interface';
import {EstimatedUsageService} from '../../services/estimated-usage/estimated-usage.service';

@Component({
  selector: 'app-usage-people-counter',
  templateUrl: './usage-people-counter.component.html',
  styleUrls: ['./usage-people-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsagePeopleCounterComponent implements OnInit, OnChanges {
  get currentEstimatedCount(): number {
    return this.estimatedUsageService.getEstimatedPeopleCount(this.currentEstimatedUsage)
  }

  @Output() estimatedUsage = new EventEmitter<number>();
  @Input() public currentEstimatedUsage = 1600;
  public plusMinusButtons: UiButtonGroup;

  constructor(
    private estimatedUsageService: EstimatedUsageService) {
  }

  ngOnInit(): void {
    this.reloadButtons();
  }

  private reloadButtons() {
    console.warn(this.currentEstimatedCount);
    console.log(this.currentEstimatedCount <= 1)
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
    console.log(this.plusMinusButtons)
  }

  public updateUsageCount(): void {
    this.estimatedUsage.emit(this.currentEstimatedUsage);
  }

  private changeEstimatedUsagePersonCount(count: number): void {
    const newEstimatedUsage = this.estimatedUsageService.getEstimatedUsage(count);
    this.currentEstimatedUsage = newEstimatedUsage || this.currentEstimatedUsage;
    this.plusMinusButtons.buttons[1].title = `${this.currentEstimatedCount} Personen`;
    this.updateUsageCount();
    this.reloadButtons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadButtons();
  }

}
