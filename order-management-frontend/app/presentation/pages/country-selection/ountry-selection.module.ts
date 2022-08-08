import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountrySelectionComponent } from './country-selection.component';
import { NbLayoutModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { CountryDropdownModule } from '../../shared/components/country-dropdown/country-dropdown.module';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [CountrySelectionComponent],
  imports: [
    CommonModule,
    NbLayoutModule,
    ThemeModule,
    CountryDropdownModule,
    RouterModule,
  ],
})
export class CountrySelectionModule { }
