import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview/overview.component';
import {PlansComponent} from './plans/plans.component';
import {OrdersComponent} from './orders/orders.component';
import {adminRoutes} from './admin.routes';
import {UiModule} from '../ui/ui.module';
import {UsersComponent} from './users/users.component';
import {FormsModule} from '@angular/forms';
import {IconsModule} from '../icons/icons.module';

@NgModule({
  declarations: [OverviewComponent, PlansComponent, OrdersComponent, UsersComponent],
    imports: [
        adminRoutes,
        CommonModule,
        FormsModule,
        UiModule,
        IconsModule
    ]
})
export class AdminModule {
}
