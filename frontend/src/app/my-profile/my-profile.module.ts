import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyOrdersComponent} from './edit/my-orders.component';
import {myProfileRoutes} from './my-profile.routes';
import {UiModule} from '../ui/ui.module';
import {MyCredentialsComponent} from './credentials/my-credentials.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MyCustomerDataComponent} from './customers/my-customer-data.component';


@NgModule({
  declarations: [MyOrdersComponent, MyCustomerDataComponent, MyCredentialsComponent],
  imports: [
    myProfileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MyProfileModule {
}
