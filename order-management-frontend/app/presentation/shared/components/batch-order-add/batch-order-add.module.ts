import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchOrderAddComponent } from './batch-order-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule, NbIconModule, NbFormFieldModule, NbPopoverModule, NbButtonModule } from '@nebular/theme';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  declarations: [BatchOrderAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    DropDownListModule,
    GridModule,
    NbPopoverModule,
    DatePickerModule,
    MultiSelectModule,
    TextBoxModule,
    NbButtonModule,
  ],
  exports: [
    BatchOrderAddComponent,
  ],
  providers: [ExcelExportService],
})
export class BatchOrderAddModule { }
