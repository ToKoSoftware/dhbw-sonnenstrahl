import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import {profileRoutes} from './profile.routes';
import {UiModule} from '../ui/ui.module';



@NgModule({
  declarations: [EditComponent],
  imports: [
    profileRoutes,
    CommonModule,
    UiModule
  ]
})
export class ProfileModule { }
