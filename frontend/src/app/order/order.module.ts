import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { SuccessComponent } from './success/success.component';
import {orderRoutes} from './order.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlansModule} from '../plans/plans.module';



@NgModule({
  declarations: [FormComponent, SuccessComponent],
    imports: [
        orderRoutes,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        UiModule,
        PlansModule
    ]
})
export class OrderModule { }
