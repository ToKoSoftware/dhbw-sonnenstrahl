import {Component, OnInit} from '@angular/core';
import {adminPages} from '../admin.routes';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  public p = adminPages;
  constructor() {
  }

  ngOnInit(): void {
  }

}
