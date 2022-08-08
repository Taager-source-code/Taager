import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CountryDropdownComponent } from "./country-dropdown.component";
@NgModule({
  declarations: [CountryDropdownComponent],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [CountryDropdownComponent],
})
export class CountryDropDownModule {}
