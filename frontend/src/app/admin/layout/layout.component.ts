import {Component, Input, OnInit} from '@angular/core';
import {adminPages} from '../admin.routes';
import {UiBreadcrumb, UiButtonGroup} from '../../ui/ui.interface';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  public p = adminPages;
  @Input() title = 'Admin';
  @Input() buttons: UiButtonGroup | null = null;
  @Input() breadcrumbs: UiBreadcrumb[] | null = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '/admin', title: 'Admin'},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
