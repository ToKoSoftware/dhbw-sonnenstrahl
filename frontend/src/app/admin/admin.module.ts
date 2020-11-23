import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { PlansComponent } from './plans/plans.component';
import { OrdersComponent } from './orders/orders.component';
import {adminRoutes} from './admin.routes';
import {UiModule} from '../ui/ui.module';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [OverviewComponent, PlansComponent, OrdersComponent, LayoutComponent, UsersComponent],
  imports: [
    adminRoutes,
    CommonModule,
    UiModule
  ]
})
export class AdminModule { }
