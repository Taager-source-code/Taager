import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDropdownComponent } from './country-dropdown.component';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [CountryDropdownComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [CountryDropdownComponent],
})
export class CountryDropdownModule { }
