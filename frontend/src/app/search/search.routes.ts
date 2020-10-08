import {RouterModule} from '@angular/router';
import {ResultsComponent} from './results/results.component';

export const searchRoutes = RouterModule.forChild([
  {path: '', component: ResultsComponent},
  {path: ':query', component: ResultsComponent},
]);
