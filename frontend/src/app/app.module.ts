import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UiModule} from './ui/ui.module';
import {IconsModule} from './icons/icons.module';
import {ApiService} from './services/api.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ErrorModule} from './error/error.module';
import {HomeModule} from './home/home.module';
import {SearchModule} from './search/search.module';
import {PlansModule} from './plans/plans.module';
import {EstimatedUsageService} from './services/estimated-usage.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    IconsModule,
    UiModule,
    HomeModule,
    PlansModule,
    SearchModule,
    ErrorModule,
  ],
  providers: [
    ApiService,
    EstimatedUsageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
