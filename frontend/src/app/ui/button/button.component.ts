import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string;
  @Input() route: string | null = null;
  @Input() icon: string | null = null;
  @Input() type: ButtonType = 'info';
  @Input() size: ButtonSize = 'normal';

}

export type ButtonType = 'blank' | 'info' | 'danger';
export type ButtonSize = 'normal' | 'small' | 'full';
