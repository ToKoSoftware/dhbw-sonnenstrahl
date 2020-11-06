import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { DetailComponent } from './detail/detail.component';
import {planRoutes} from './plans.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [OverviewComponent, DetailComponent],
  imports: [
    planRoutes,
    CommonModule,
    UiModule,
    FormsModule
  ]
})
export class PlansModule { }
