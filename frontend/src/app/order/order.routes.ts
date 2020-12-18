import {RouterModule} from '@angular/router';
import {OrderComponent} from './order/order.component';
import {SuccessComponent} from './success/success.component';

export const orderRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OrderComponent},
  {path: ':id/:usage', component: OrderComponent},
  {path: 'success', component: SuccessComponent},
]);
