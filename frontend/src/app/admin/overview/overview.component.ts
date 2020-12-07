import {Component, OnInit} from '@angular/core';
import {adminBreadcrumb, adminPages} from '../admin.pages';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  public tiles: StatisticTile[] = [{
    title: 'Benutzer',
    count: 300,
    icon: 'mouse-pointer'
  }, {
    title: 'Kunden',
    count: 300,
    icon: 'user'
  }, {
    title: 'Bestellungen',
    count: 300,
    icon: 'shopping-cart'
  }, {
    title: 'Tarife',
    count: 300,
    icon: 'map'
  }];

  constructor() {
  }

  ngOnInit(): void {

  }

}

interface StatisticTile {
  title: string;
  icon: string;
  count: number;
}
