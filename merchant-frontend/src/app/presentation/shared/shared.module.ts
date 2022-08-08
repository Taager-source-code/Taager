import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { LoaderComponent } from './components/loader/loader.component';
import { NoRecordFoundComponent } from './components/no-record-found/no-record-found.component';
import { HoverStyleDirective } from './directives/hover-style.directive';
import { OrderComponent } from './components/order/order.component';
import { InputComponent } from './components/order/input-control/input.component';
import { OrderPromotionsComponent } from './components/order/order-promotions/order-promotions.component';
import { SelectedCountryTooltipComponent } from './components/selected-country-tooltip/selected-country-tooltip.component';
import { PaymentRequestMethodPipe } from './pipes/payment-request-method.pipe';
import { PaymentRequestStatusPipe } from './pipes/payment-request-status.pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ProductAvailabilityPipe } from './pipes/product-availability.pipe';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { ProfileCardComponent } from '../profile/profile-card/profile-card.component';
import { OrderOverviewComponent } from '../orders/order-overview/order-overview.component';
import { HttpClientModule } from '@angular/common/http';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import {
  MegaMenuActionButtonComponent
} from './containers/default-layout/header/main-header/mega-menu-action-button/mega-menu-action-button.component';
import { MegaMenuModule } from '../mega-menu/mega-menu.module';
import { QuestionnaireBannerComponent } from './components/questionnaire-banner/questionnaire-banner.component';

@NgModule({
  declarations: [
    OrderComponent,
    InputComponent,
    LoaderComponent,
    NoRecordFoundComponent,
    HoverStyleDirective,
    OrderPromotionsComponent,
    SelectedCountryTooltipComponent,
    PaymentRequestMethodPipe,
    PaymentRequestStatusPipe,
    ProductAvailabilityPipe,
    SuccessMessageComponent,
    OrderOverviewComponent,
    ProfileCardComponent,
    BreadcrumbsComponent,
    MegaMenuActionButtonComponent,
    QuestionnaireBannerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    ClipboardModule,
    AngularMultiSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatGridListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTableModule,
    PaginationModule.forRoot(),
    HttpClientModule,
    MatRippleModule,
    MegaMenuModule,
  ],
  exports: [
    OrderComponent,
    InputComponent,
    LoaderComponent,
    NoRecordFoundComponent,
    HoverStyleDirective,
    OrderPromotionsComponent,
    MatSidenavModule,
    ClipboardModule,
    SelectedCountryTooltipComponent,
    PaymentRequestMethodPipe,
    PaymentRequestStatusPipe,
    AngularMultiSelectModule,
    ProductAvailabilityPipe,
    SuccessMessageComponent,
    MatButtonModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule,
    MatFormFieldModule,
    MatGridListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTableModule,
    OrderOverviewComponent,
    ProfileCardComponent,
    HttpClientModule,
    MegaMenuActionButtonComponent,
    MatRippleModule,
    BreadcrumbsComponent,
    QuestionnaireBannerComponent
  ]
})
export class SharedModule { }


