import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {OrdersComponent} from './orders/orders.component';
import {PlansComponent} from './plans/plans.component';
import {UsersComponent} from './users/users.component';

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'users', component: UsersComponent},
  {path: 'plans', component: PlansComponent},
]);
