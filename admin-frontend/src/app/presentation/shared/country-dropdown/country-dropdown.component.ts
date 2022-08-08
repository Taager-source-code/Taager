import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { SharedService } from "../services/shared.service";
import * as CountryResolver from "@taager-shared/country-resolver";
@Component({
  selector: "app-country-dropdown",
  templateUrl: "./country-dropdown.component.html",
  styleUrls: ["./country-dropdown.component.scss"],
})
export class CountryDropdownComponent implements OnInit {
  countriesList = [];
  @Input() filterUse;
  @Input() type;
  @Input() selectedCountries: string[];
  @Input() fieldDisabled;
  @Output() public selectedCountry = new EventEmitter<string | string[]>();
  constructor(
    public sharedService: SharedService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.sharedService.selectedCountryIso3 =
      this.sharedService.userCountryAccess[0];
    if (this.selectedCountries) {
      this.selectedCountry.emit(this.selectedCountries);
      this.sharedService.getCountriesList().subscribe(
        (countries) => {
          this.countriesList = countries;
        },
        () => {
          this.toastr.error(
            "Error occured while featching the countries list!"
          );
        }
      );
    } else {
      this.selectedCountry.emit(this.sharedService.selectedCountryIso3);
    }
  }
  selectCountry(event) {
    this.sharedService.selectedCountryIso3 = event.value;
    this.selectedCountry.emit(this.sharedService.selectedCountryIso3);
  }
  selectMultipleCountries(event) {
    this.selectedCountry.emit(event.value);
  }
  getCountryEnglishName(country) {
    return CountryResolver.getCountryFromIsoCode3(country).englishName;
  }
  resetSelection() {
    let event = {
      value: this.sharedService.userCountryAccess[0],
    };
    this.selectCountry(event);
  }
}
