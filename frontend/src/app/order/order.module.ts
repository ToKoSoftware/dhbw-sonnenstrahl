import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { SuccessComponent } from './success/success.component';
import {orderRoutes} from './order.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrderComponent } from './order/order.component';
import { CreateCustomerComponent } from './order/create-customer/create-customer.component';
import { SelectCustomerComponent } from './order/select-customer/select-customer.component';
import { LoginModalComponent } from './order/login-modal/login-modal.component';
import { RegisterModalComponent } from './order/register-modal/register-modal.component';


@NgModule({
  declarations: [FormComponent, SuccessComponent, OrderComponent, CreateCustomerComponent, SelectCustomerComponent, LoginModalComponent, RegisterModalComponent],
    imports: [
        orderRoutes,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        UiModule
    ]
})
export class OrderModule { }
