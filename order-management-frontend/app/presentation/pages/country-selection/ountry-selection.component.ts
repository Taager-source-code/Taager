import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { LocalStorageService } from '../../services/localStorage.service';
import { MultitenancyService } from '../../services/multitenancy.service';
@Component({
  selector: 'ngx-country-selection',
  templateUrl: './country-selection.component.html',
  styleUrls: ['./country-selection.component.scss'],
})
export class CountrySelectionComponent {
  imgUrl: string = environment.imgUrl;
  constructor(
    private multitenancyService: MultitenancyService,
    private localStorage: LocalStorageService,
  ) { }
  setSelectedCountry(){
    this.localStorage.setStorage('country', this.multitenancyService.selectedCountry);
  }
}
