import {RouterModule} from '@angular/router';
import {OrderComponent} from './order/order.component';
import {SuccessComponent} from './success/success.component';

export const orderRoutes = RouterModule.forChild([
  {path: 'success', component: SuccessComponent},
  {path: 'checkout/:id/:usage', pathMatch: 'full', component: OrderComponent},
]);
