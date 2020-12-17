import {FormComponent} from './form/form.component';
import {RouterModule} from '@angular/router';
import {OrderComponent} from './order/order.component';

export const orderRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OrderComponent},
  {path: ':id/:usage', component: OrderComponent},
  {path: 'checkout', component: FormComponent},
]);
