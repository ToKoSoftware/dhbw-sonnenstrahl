import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string;
  @Input() route: string | null;
  @Input() type: ButtonType = 'info';

  constructor() {
  }

  ngOnInit(): void {
  }

}

export type ButtonType = 'info' | 'danger';
