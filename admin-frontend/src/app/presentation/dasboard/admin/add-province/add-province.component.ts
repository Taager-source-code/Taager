import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { ProvinceService } from "../../services/province.service";
import { SharedService } from "../../../shared/services/shared.service";
import * as CountryResolver from "@taager-shared/country-resolver";

export interface Province {
  id: string;
  location: string;
  branch: string;
  shippingRevenue: string;
  shippingCost: string;
  minETA: Number;
  maxETA: Number;
  isActive: boolean;
  edit: boolean;
  redZones: string[];
  greenZones: string[];
  country;
}

@Component({
  selector: "app-add-province",
  templateUrl: "./add-province.component.html",
  styleUrls: ["./add-province.component.scss"],
})
export class AddProvinceComponent implements OnInit {
  public selectedCountry = this.data.country;
  public location = this.data.location;
  public branch = this.data.branch;
  public shippingRevenue = this.data.shippingRevenue;
  public shippingCost = this.data.shippingCost;
  public minETA = this.data.minETA;
  public maxETA = this.data.maxETA;
  public isActive = this.data.isActive;
  public edit = this.data.edit;
  public redZones = this.data.redZones || [];
  public greenZones = this.data.greenZones || [];
  public zonesForm: FormGroup;
  public redZonesFilterCtrl: FormControl = new FormControl();
  public greenZonesFilterCtrl: FormControl = new FormControl();

  constructor(
    private toastr: ToastrService,
    private provinceService: ProvinceService,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<AddProvinceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Province
  ) {
    this.zonesForm = new FormGroup({
      redZone: new FormControl(),
      greenZone: new FormControl(),
    });
  }
  userCountries;
  ngOnInit(): void {
    this.userCountries = this.sharedService.userCountryAccess;
    this.redZonesFilterCtrl.valueChanges.subscribe(
      ([prev, next]: [any, any]) => {
        this.filterRedZoneItem();
      }
    );
    this.greenZonesFilterCtrl.valueChanges.subscribe(
      ([prev, next]: [any, any]) => {
        this.filterGreenZoneItem();
      }
    );
  }

  filterRedZoneItem() {
    let search = this.redZonesFilterCtrl.value;
    if (!search) {
      this.redZones = this.data.redZones || [];
      return 0;
    }
    this.redZones = this.data.redZones.filter((a) => a.startsWith(search));
  }
  filterGreenZoneItem() {
    let search = this.greenZonesFilterCtrl.value;
    if (!search) {
      this.greenZones = this.data.greenZones || [];
      return 0;
    }
    this.greenZones = this.data.greenZones.filter((a) => a.startsWith(search));
  }
  onRegister() {
    const provinceInfo = {
      location: this.location,
      branch: this.branch,
      shippingRevenue: this.shippingRevenue,
      shippingCost: this.shippingCost,
      minETA: this.minETA,
      maxETA: this.maxETA,
      isActive: this.isActive,
      country: this.sharedService.selectedCountryIso3,
    };
    if (this.edit) {
      this.provinceService.updateProvince(this.data.id, provinceInfo).subscribe(
        (response: any) => {
          this.dialogRef.close();
          this.toastr.success(response.msg);
          this.dialogRef.close();
        },
        (err) => {
          this.toastr.error(err.error.msg);
        }
      );
    } else {
      this.provinceService.createProvince(provinceInfo).subscribe(
        (response: any) => {
          this.dialogRef.close();
          this.toastr.success(response.msg);
          this.dialogRef.close();
        },
        (err) => {
          this.toastr.error(err.error.msg);
        }
      );
    }
  }
  updateProvinces() {
    const provinces = [
      {
        province: this.location,
        redZones: this.redZones,
        greenZones: this.greenZones,
      },
    ];
    let country = this.selectedCountry;
    let obj = {
      provinces,
      country,
    };
    this.provinceService.addProvinceZones(obj).subscribe(
      (response: any) => {
        this.toastr.success(response.msg);
        this.zonesForm.reset();
      },
      (err) => {
        this.toastr.error(`${this.location} updated failed`);
      }
    );
  }
  addRedZone(event) {
    let redZone = this.zonesForm.value.redZone;
    if (!redZone) return;
    this.redZones.push(redZone);
    this.updateProvinces();
  }
  addGreenZone(event) {
    let greenZone = this.zonesForm.value.greenZone;
    if (!greenZone) return;
    this.greenZones.push(greenZone);
    this.updateProvinces();
  }
  deleteRedZone(ev: Event, redZone) {
    ev.stopPropagation();
    ev.preventDefault();
    if (confirm(`Are you sure you want to DELETE ${redZone} Zone ?`)) {
      this.redZones = this.redZones.filter((z) => z !== redZone);
      this.updateProvinces();
    }
  }
  deleteGreenZone(ev: Event, greenZone) {
    ev.stopPropagation();
    ev.preventDefault();
    if (confirm(`Are you sure you want to DELETE ${greenZone} Zone ?`)) {
      this.greenZones = this.greenZones.filter((z) => z !== greenZone);
      this.updateProvinces();
    }
  }
  selectCountry(event) {
    this.selectedCountry = event.value;
  }
  getCountryEnglishName(country) {
    return CountryResolver.getCountryFromIsoCode3(country).englishName;
  }
}
