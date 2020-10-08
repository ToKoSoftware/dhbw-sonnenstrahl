import {Component, Input, OnInit} from '@angular/core';
import {UiButtonGroup} from '../ui.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('title') title = '';
  @Input('buttons') buttons: UiButtonGroup | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
