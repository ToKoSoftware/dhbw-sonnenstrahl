import {RouterModule} from '@angular/router';
import {EditComponent} from './edit/edit.component';
import {CredentialsComponent} from './credentials/credentials.component';
import {CustomersComponent} from './customers/customers.component';

export const profileRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: EditComponent},
  {path: 'customers', component: CustomersComponent},
  {path: 'credentials', component: CredentialsComponent},
]);
