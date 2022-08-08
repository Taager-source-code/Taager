import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GetCountriesUseCase } from '@core/usecases/country/get-countries.usecase';
import { SharedAPIService } from '../../shared-apis/sharedapi.service';
import { CountryModel } from '@core/domain/country.model';
import { MyToastService } from '@presentation/@core/utils/myToast.service';
import { parseJwt } from '@presentation/@core/utils/functions';
@Component({
  selector: 'country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
})
export class CountryDropdownComponent implements OnInit {
  @Output() selectedCountryChanged = new EventEmitter<CountryModel>();
  countries: CountryModel[] = [];
  selectedCountry: CountryModel;
  constructor(
    public sharedService: SharedAPIService,
    private getCountriesUseCase: GetCountriesUseCase,
    private toast: MyToastService,
  ) {}
  ngOnInit(): void {
    this.getCountriesList();
  }
  getCountriesList(){
    this.getCountriesUseCase.execute().subscribe(countriesList => {
      const countries = countriesList;
      const userAccessCountries = parseJwt(localStorage.getItem('user')).userAccessCountries;
      this.countries = userAccessCountries.map(userAccessCountry =>
        countries.filter(country => country.isoCode3 === userAccessCountry)[0]);
      if(this.countries.length) {
        this.selectedCountry = this.countries[0];
        this.selectedCountryChanged.emit(this.selectedCountry);
      } else {
        this.toast.showToast('Error', 'User has no countries access', 'error');
      }
    });
  }
  countrySelected(country: CountryModel){
    if(country.isoCode3 !== this.selectedCountry.isoCode3) {
      this.selectedCountry = country;
      this.selectedCountryChanged.emit(this.selectedCountry);
    }
  }
}
