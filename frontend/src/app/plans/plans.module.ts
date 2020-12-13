import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { PlanDetailComponent } from '../ui/detail/plan-detail.component';
import {planRoutes} from './plans.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule} from '@angular/forms';
import { UsagePeopleCounterComponent } from './usage-people-counter/usage-people-counter.component';

@NgModule({
  declarations: [OverviewComponent, UsagePeopleCounterComponent],
  imports: [
    planRoutes,
    CommonModule,
    UiModule,
    FormsModule
  ]
})
export class PlansModule { }
