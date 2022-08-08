import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { GalleryModule } from "ng-gallery";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { CountryDropDownModule } from "./shared/country-dropdown/country-dropdown.module";
const THIRD_PARTY_MODULES = [
  NgxSpinnerModule,
  CountryDropDownModule,
  GalleryModule,
  PerfectScrollbarModule,
  NgxMatSelectSearchModule,
  NgxSpinnerModule,
  AngularMultiSelectModule,
  NgbModule,
  CarouselModule,
  CountryDropDownModule,
  PaginationModule,
  ToastrModule,
  PaginationModule,
  BsDropdownModule,
  CollapseModule,
];
@NgModule({
  exports: [...THIRD_PARTY_MODULES],
  imports: [...THIRD_PARTY_MODULES],
})
export class ThirdPartyModule {}