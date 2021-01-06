import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {ButtonComponent} from './button/button.component';
import {ButtonGroupComponent} from './button-group/button-group.component';
import {ModalComponent} from './modals/modal/modal.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {IconsModule} from '../icons/icons.module';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {ContainerComponent} from './container/container.component';
import {FormsModule} from '@angular/forms';
import {NavSpacerComponent} from './nav-spacer/nav-spacer.component';
import {ButtonGroupButtonComponent} from './button-group-button/button-group-button.component';
import {SidebarItemComponent} from './sidebar-item/sidebar-item.component';
import {LoadingComponent} from './loading/loading.component';
import {ConfirmModalComponent} from './modals/confirm-modal/confirm-modal.component';
import {LoadingModalComponent} from './modals/loading-modal/loading-modal.component';
import {CustomModalComponent} from './modals/custom-modal/custom-modal.component';
import {LayoutComponent} from './layout/layout.component';
import {InputComponent} from './input/input.component';
import {LabeledValueComponent} from './labeled-value/labeled-value.component';
import {ZeroDataComponent} from './zero-data/zero-data.component';
import {PlanDetailComponent} from './detail/plan-detail.component';
import {UsagePeopleCounterComponent} from './usage-people-counter/usage-people-counter.component';
import {FilterComponent} from './filter/filter.component';
import {PaginationComponent} from './pagination/pagination.component';


@NgModule({
  declarations: [
    NavbarComponent,
    ButtonComponent,
    ButtonGroupComponent,
    ModalComponent,
    SidebarComponent,
    HeaderComponent,
    ContainerComponent,
    NavSpacerComponent,
    ButtonGroupButtonComponent,
    SidebarItemComponent,
    LoadingComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    CustomModalComponent,
    LayoutComponent,
    InputComponent,
    LabeledValueComponent,
    ZeroDataComponent,
    PlanDetailComponent,
    UsagePeopleCounterComponent,
    FilterComponent,
    PaginationComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    HeaderComponent,
    ContainerComponent,
    ButtonComponent,
    NavSpacerComponent,
    ButtonGroupComponent,
    LoadingComponent,
    ModalComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    CustomModalComponent,
    LayoutComponent,
    InputComponent,
    LabeledValueComponent,
    ZeroDataComponent,
    PlanDetailComponent,
    UsagePeopleCounterComponent,
    FilterComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    IconsModule,
    RouterModule,
    FormsModule
  ]
})
export class UiModule {
}
