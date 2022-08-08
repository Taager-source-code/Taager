import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShippingCapacityComponent } from './shipping-capacity.component';
import
{ NbAccordionModule,
NbButtonModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbToggleModule} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ProvinceCardComponent } from './province-card/province-card.component';
import { ZonesListComponent } from './province-card/zones-list/zones-list.component';
import { ShippingCapacityTableComponent } from './shipping-capacity-table/shipping-capacity-table.component';
import { NumericTextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { AllocationServiceComponent } from './allocation-service/allocation-service.component';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { UnAllocationServiceComponent } from './un-allocation-service/un-allocation-service.component';
import { FileUtilityService } from '@presentation/@core/utils/fileUtility.service';
const routes: Routes = [
  {
    path: '',
    component: ShippingCapacityComponent,
  },
];
@NgModule({
  declarations: [
    ShippingCapacityComponent,
    ProvinceCardComponent,
    ZonesListComponent,
    ShippingCapacityTableComponent,
    AllocationServiceComponent,
    UnAllocationServiceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NbLayoutModule,
    NbInputModule,
    NbFormFieldModule,
    NbButtonModule,
    NbIconModule,
    NbAccordionModule,
    ComboBoxModule,
    DragDropModule,
    TimePickerModule,
    NumericTextBoxModule,
    NgxSpinnerModule,
    CheckBoxModule,
    SidebarModule,
    NbToggleModule,
    UploaderModule,
  ],
  providers: [
    FileUtilityService,
  ],
})
export class ShippingCapacityModule { }
