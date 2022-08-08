import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EligibleOrdersComponent } from './eligible-orders.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbToggleModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, PageService } from '@syncfusion/ej2-angular-grids';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ThemeModule } from '../../@theme/theme.module';
import { CountryDropdownModule } from '@presentation/shared/components/country-dropdown/country-dropdown.module';
import { EligibleOrdersGridComponent } from './eligible-orders-grid/eligible-orders-grid.component';
import { CreateAfterSalesComponent } from './create-after-sales/create-after-sales.component';
const routes: Routes = [
  {
    path: '',
    component: EligibleOrdersComponent,
  },
];
@NgModule({
  declarations: [
    EligibleOrdersComponent,
    OrderDetailsComponent,
    EligibleOrdersGridComponent,
    CreateAfterSalesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    NbFormFieldModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    GridModule,
    SidebarModule,
    NbCardModule,
    ThemeModule,
    CountryDropdownModule,
    NbAlertModule,
    NbRadioModule,
    NbSelectModule,
    NbToggleModule,
    ReactiveFormsModule,
  ],
  providers: [
    PageService,
  ],
})
export class EligibleOrdersModule { }
