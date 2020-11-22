import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {loginRegisterRoutes} from './login-register.routes';
import {UiModule} from '../ui/ui.module';

@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [
    loginRegisterRoutes,
    CommonModule,
    UiModule
  ]
})
export class LoginRegisterModule { }
