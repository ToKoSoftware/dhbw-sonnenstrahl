import {FormComponent} from './form/form.component';
import {RouterModule} from '@angular/router';

export const orderRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: FormComponent},
  {path: ':id/:usage', component: FormComponent},
  {path: 'checkout', component: FormComponent},
]);
