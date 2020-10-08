import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { SuccessComponent } from './success/success.component';



@NgModule({
  declarations: [FormComponent, SuccessComponent],
  imports: [
    CommonModule
  ]
})
export class OrderModule { }
