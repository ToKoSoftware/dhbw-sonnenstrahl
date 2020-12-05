import {RouterModule} from '@angular/router';
import {EditComponent} from './edit/edit.component';

export const profileRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: EditComponent},
]);
