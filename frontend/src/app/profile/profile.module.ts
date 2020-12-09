import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import {profileRoutes} from './profile.routes';
import {UiModule} from '../ui/ui.module';
import { CredentialsComponent } from './credentials/credentials.component';
import {ReactiveFormsModule} from '@angular/forms';
import { CustomersComponent } from './customers/customers.component';
import {PlansModule} from '../plans/plans.module';



@NgModule({
  declarations: [EditComponent],
  imports: [
    profileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    PlansModule
  ]
})
export class ProfileModule { }
