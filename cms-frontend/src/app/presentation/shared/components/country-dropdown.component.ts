import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProductsService } from '@presentation/@core/utils/products.service';
@Component({
  selector: 'ngx-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
})
export class CountryDropdownComponent implements OnInit, AfterViewInit {
  @Input() isReadOnly = false;
  countryFields = { text: 'englishName', value: 'isoCode3' };
  constructor(
    private cd: ChangeDetectorRef,
    public productsService: ProductsService,
  ) { }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  changeSelectedCountry({ value }) {
    this.productsService.setSelectedCountryCode(value);
  }
}
