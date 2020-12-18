import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuccessComponent} from './success/success.component';
import {orderRoutes} from './order.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrderComponent} from './order/order.component';
import {CreateCustomerComponent} from './order/create-customer/create-customer.component';
import {SelectCustomerModalComponent} from './order/select-customer-modal/select-customer-modal.component';
import {LoginModalComponent} from './order/login-modal/login-modal.component';
import {RegisterModalComponent} from './order/register-modal/register-modal.component';
import {PlansModule} from '../plans/plans.module';


@NgModule({
  declarations: [SuccessComponent, OrderComponent, CreateCustomerComponent, SelectCustomerModalComponent, LoginModalComponent, RegisterModalComponent],
  imports: [
    orderRoutes,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UiModule,
    PlansModule
  ]
})
export class OrderModule {
}
