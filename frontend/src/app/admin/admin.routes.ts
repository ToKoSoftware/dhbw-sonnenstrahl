import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {OrdersComponent} from './orders/orders.component';
import {PlansComponent} from './plans/plans.component';
import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UsersComponent} from './users/users.component';

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'users', component: UsersComponent},
  {path: 'plans', component: PlansComponent},
]);

export const adminPages: SidebarPageGroup[] = [
  {
    title: 'Admin',
    pages: [
      {
        title: 'Statistiken',
        icon: 'bar-chart-2',
        url: '/admin/',
        matchFull: true
      },
      {
        title: 'Benutzer und Kunden',
        icon: 'user',
        url: '/admin/users',
      },
      {
        title: 'Tarife',
        icon: 'map',
        url: '/admin/plans',
      },
      {
        title: 'Bestellungen',
        icon: 'shopping-cart',
        url: '/admin/orders',
      }
    ]
  }
];
