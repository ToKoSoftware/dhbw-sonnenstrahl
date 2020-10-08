import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {UiModule} from '../ui/ui.module';
import {homeRoutes} from './home.routes';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    homeRoutes,
    CommonModule,
    UiModule
  ]
})
export class HomeModule { }
