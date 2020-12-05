import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404Component} from './error/error404/error404.component';
import {CommonModule} from '@angular/common';
import {IsLoggedInGuard} from './guards/is-logged-in.guard';
import {IsAdminGuard} from './guards/is-admin.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'search',
    loadChildren: './search/search.module#SearchModule'
  },
  {
    path: 'plans',
    loadChildren: './plans/plans.module#PlansModule'
  },
  {
    path: 'profile',
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: 'order',
      loadChildren: './order/order.module#OrderModule'
  },
  {
    path: 'login',
    loadChildren: './login-register/login-register.module#LoginRegisterModule'
  },
  {
    path: 'admin',
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    canActivateChild: [IsLoggedInGuard, IsAdminGuard],
    loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: '**',
    component: Error404Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
