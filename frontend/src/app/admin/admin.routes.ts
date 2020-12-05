import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {OrdersComponent} from './orders/orders.component';
import {PlansComponent} from './plans/plans.component';
import {UsersComponent} from './users/users.component';
import {CustomersComponent} from './customers/customers.component';

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'users', component: UsersComponent},
  {path: 'customers', component: CustomersComponent},
  {path: 'plans', component: PlansComponent},
]);
