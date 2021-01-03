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
import {UploadCsvComponent} from './plans/upload-csv/upload-csv.component';
import {DragDropDirective} from './plans/upload-csv/drag-and-drop.directive';
import {CustomersComponent} from './customers/customers.component';
import {RelatedCustomersComponent} from './users/related-customers/related-customers.component';
import {OrderRowComponent} from './orders/order-row/order-row.component';
import {ChartsModule} from 'ng2-charts';
import {AdminLineStatsComponent} from './overview/admin-line-stats/admin-line-stats.component';
import {AdminPieStatsComponent} from './overview/admin-pie-stats/admin-pie-stats.component';
import {AdminReferrerStatsComponent} from './overview/admin-referrer-stats/admin-referrer-stats.component';

@NgModule({
  declarations: [
    OverviewComponent,
    PlansComponent,
    OrdersComponent,
    UsersComponent,
    CustomersComponent,
    UploadCsvComponent,
    DragDropDirective,
    RelatedCustomersComponent,
    OrderRowComponent,
    AdminLineStatsComponent,
    AdminPieStatsComponent,
    AdminReferrerStatsComponent
  ],
  imports: [
    adminRoutes,
    CommonModule,
    FormsModule,
    UiModule,
    IconsModule,
    ChartsModule
  ]
})
export class AdminModule {
}
