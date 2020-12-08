import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { DetailComponent } from './detail/detail.component';
import {planRoutes} from './plans.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule} from '@angular/forms';
import { UsagePeopleCounterComponent } from './usage-people-counter/usage-people-counter.component';

@NgModule({
  declarations: [OverviewComponent, DetailComponent, UsagePeopleCounterComponent],
  exports: [DetailComponent],
  imports: [
    planRoutes,
    CommonModule,
    UiModule,
    FormsModule
  ]
})
export class PlansModule { }
