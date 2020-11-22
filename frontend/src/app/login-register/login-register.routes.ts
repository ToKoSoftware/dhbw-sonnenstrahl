import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

export const loginRegisterRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
]);
