import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { SuccessComponent } from './success/success.component';
import {orderRoutes} from './order.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [FormComponent, SuccessComponent],
  imports: [
    orderRoutes,
    FormsModule,
    CommonModule,
    UiModule
  ]
})
export class OrderModule { }
