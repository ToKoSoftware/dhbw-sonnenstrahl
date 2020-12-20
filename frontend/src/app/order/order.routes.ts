import {RouterModule} from '@angular/router';
import {OrderComponent} from './order/order.component';
import {SuccessComponent} from './success/success.component';
import {CreateCustomerModalComponent} from './order/create-customer-modal/create-customer-modal.component';

export const orderRoutes = RouterModule.forChild([
  {path: 'success', component: SuccessComponent},
  {path: 'debug', component: CreateCustomerModalComponent},
  {path: 'checkout/:id/:usage', pathMatch: 'full', component: OrderComponent},
]);
