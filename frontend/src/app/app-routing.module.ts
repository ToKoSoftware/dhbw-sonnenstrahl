import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404Component} from './error/error404/error404.component';
import {CommonModule} from '@angular/common';

const routes: Routes = [
  {path: '', pathMatch: 'full', loadChildren: './home/home.module#HomeModule'},
  {path: 'search', loadChildren: './search/search.module#SearchModule'},

  {path: 'plans', loadChildren: './plans/plans.module#PlansModule'},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
  {path: '**', component: Error404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
