import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UiButtonGroup, UiButtonType} from '../../ui/ui.interface';
import {EstimatedUsageService} from '../../services/estimated-usage/estimated-usage.service';

@Component({
  selector: 'app-usage-people-counter',
  templateUrl: './usage-people-counter.component.html',
  styleUrls: ['./usage-people-counter.component.scss']
})
export class UsagePeopleCounterComponent implements OnInit {
  @Output() estimatedUsage = new EventEmitter<number>();
  public currentEstimatedUsage = 1000;
  public currentEstimatedCount = 1;
  public plusMinusButtons: UiButtonGroup = {
    buttons: [
      {
        title: '-',
        function: () => {
          this.changeEstimatedUsagePersonCount(this.currentEstimatedCount - 1);
        },
        type: UiButtonType.disabled
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

  constructor(
    private estimatedUsageService: EstimatedUsageService) {
  }

  ngOnInit(): void {
  }

  public updateUsageCount(): void {
    this.estimatedUsage.emit(this.currentEstimatedUsage);
  }

  private changeEstimatedUsagePersonCount(count: number): void {
    this.currentEstimatedCount = count;
    this.plusMinusButtons.buttons[1].title = `${this.currentEstimatedCount} Personen`;
    const newEstimatedUsage = this.estimatedUsageService.getEstimatedUsage(count);
    this.currentEstimatedUsage = newEstimatedUsage || this.currentEstimatedUsage;
    this.plusMinusButtons.buttons[0].type = count - 1 === 0 ? UiButtonType.disabled : undefined;
    this.updateUsageCount();
  }
}
