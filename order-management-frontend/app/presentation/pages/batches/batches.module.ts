import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesListComponent } from './batches-list/batches-list.component';
import { RouterModule, Routes } from '@angular/router';
import {
  NbAlertModule,
  NbButtonModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbPopoverModule,
  NbToastrModule } from '@nebular/theme';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridModule, PageService } from '@syncfusion/ej2-angular-grids';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { CreateBatchFormModule } from '../../shared/components/create-batch-form/create-batch-form.module';
import { BatchOrderAddModule } from '../../shared/components/batch-order-add/batch-order-add.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
const routes: Routes = [
  {
    path: '',
    component: BatchesListComponent,
  },
];
@NgModule({
  declarations: [
    BatchesListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NbLayoutModule,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    NbButtonModule,
    DropDownListModule,
    GridModule,
    NbPopoverModule,
    SidebarModule,
    DatePickerModule,
    MultiSelectModule,
    TextBoxModule,
    DateRangePickerModule,
    CreateBatchFormModule,
    BatchOrderAddModule,
    NbToastrModule,
    NumericTextBoxModule,
    NgxSpinnerModule,
    NbAlertModule,
  ],
  providers: [PageService ],
})
export class BatchesModule { }
