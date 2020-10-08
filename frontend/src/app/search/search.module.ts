import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results/results.component';
import {searchRoutes} from './search.routes';
import {UiModule} from '../ui/ui.module';

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    searchRoutes,
    CommonModule,
    UiModule
  ]
})
export class SearchModule { }
