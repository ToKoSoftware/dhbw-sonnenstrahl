import {NgModule} from '@angular/core';
import {FeatherModule} from 'angular-feather';
import {
  AlertCircle,
  BarChart2,
  ChevronRight,
  DownloadCloud,
  File,
  Key,
  LogIn,
  LogOut,
  Map,
  MousePointer,
  Search,
  ShoppingCart,
  Trash,
  UploadCloud,
  User,
  Users
} from 'angular-feather/icons';
import {CommonModule} from '@angular/common';

/**
 * Load icons
 */
const icons = {
  User,
  Users,
  ShoppingCart,
  BarChart2,
  UploadCloud,
  DownloadCloud,
  Map,
  Trash,
  Key,
  MousePointer,
  AlertCircle,
  File,
  LogOut,
  LogIn,
  Search, ChevronRight
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
export class IconsModule {
}
