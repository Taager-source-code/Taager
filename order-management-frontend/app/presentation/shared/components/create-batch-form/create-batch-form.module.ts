import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBatchFormComponent } from './create-batch-form.component';
import { NbInputModule, NbIconModule, NbFormFieldModule, NbButtonModule, NbPopoverModule } from '@nebular/theme';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFormErrorModule } from 'ngx-form-error';
@NgModule({
  declarations: [
    CreateBatchFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    NbButtonModule,
    DropDownListModule,
    DatePickerModule,
    MultiSelectModule,
    TextBoxModule,
    DateRangePickerModule,
    NgxFormErrorModule,
  ],
  exports: [
    CreateBatchFormComponent,
  ],
})
export class CreateBatchFormModule { }