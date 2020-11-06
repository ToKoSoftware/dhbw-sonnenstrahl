import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {DetailComponent} from './detail/detail.component';

export const planRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: ':postcode', component: OverviewComponent},
  {path: 'details/:id', component: DetailComponent},
]);
