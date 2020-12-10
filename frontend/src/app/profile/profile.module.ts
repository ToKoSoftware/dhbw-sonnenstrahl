import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit/edit.component';
import {profileRoutes} from './profile.routes';
import {UiModule} from '../ui/ui.module';
import {CredentialsComponent} from './credentials/credentials.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomersComponent} from './customers/customers.component';


@NgModule({
  declarations: [EditComponent, CustomersComponent, CredentialsComponent],
  imports: [
    profileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfileModule {
}
