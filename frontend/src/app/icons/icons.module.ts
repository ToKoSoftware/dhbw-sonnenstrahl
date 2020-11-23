import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { User, ShoppingCart, BarChart2 } from 'angular-feather/icons';
import {CommonModule} from '@angular/common';

// Select some icons (use an object, not an array)
const icons = {
  User,
  ShoppingCart,
  BarChart2
};

@NgModule({
  imports: [
    FeatherModule.pick(icons),
    CommonModule
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
