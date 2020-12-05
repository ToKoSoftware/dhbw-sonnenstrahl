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
import { UploadCsvComponent } from './plans/upload-csv/upload-csv.component';
import {DragDropDirective} from './plans/upload-csv/drag-and-drop.directive';
import {CustomersComponent} from './customers/customers.component';

@NgModule({
  declarations: [
    OverviewComponent,
    PlansComponent,
    OrdersComponent,
    UsersComponent,
    CustomersComponent,
    UploadCsvComponent,
    DragDropDirective
  ],
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
