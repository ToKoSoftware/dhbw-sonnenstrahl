import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {myProfileRoutes} from './my-profile.routes';
import {UiModule} from '../ui/ui.module';
import {MyCredentialsComponent} from './credentials/my-credentials.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MyCustomerDataComponent} from './customers/my-customer-data.component';
import { OrderDetailComponent } from './my-orders/order-detail/order-detail.component';
import {IconsModule} from '../icons/icons.module';
import {MomentModule} from 'ngx-moment';


@NgModule({
  declarations: [MyOrdersComponent, MyCustomerDataComponent, MyCredentialsComponent, OrderDetailComponent],
  imports: [
    myProfileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    IconsModule,
    MomentModule
  ]
})
export class MyProfileModule {
}
