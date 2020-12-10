import {RouterModule} from '@angular/router';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {MyCredentialsComponent} from './credentials/my-credentials.component';
import {MyCustomerDataComponent} from './customers/my-customer-data.component';

export const myProfileRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: MyOrdersComponent},
  {path: 'customers', component: MyCustomerDataComponent},
  {path: 'credentials', component: MyCredentialsComponent},
]);
