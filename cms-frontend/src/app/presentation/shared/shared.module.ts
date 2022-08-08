import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDropdownComponent } from './components/country-dropdown/country-dropdown.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import {
  NbAccordionModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule,
 } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const SHARED_COMPONENTS = [
  FormsModule,
  ReactiveFormsModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbSpinnerModule,
  NbAccordionModule,
  NbIconModule,
];
@NgModule({
  declarations: [
    CountryDropdownComponent,
  ],
  imports: [
    CommonModule,
    DropDownListModule,
    ...SHARED_COMPONENTS,
  ],
  exports: [
    CountryDropdownComponent,
    ...SHARED_COMPONENTS,
  ],
})
export class SharedModule { }
