import { Component, Input, OnInit } from '@angular/core';
import { ProvinceCapacityModel } from '../../../../core/domain/capacity.model';
import { PROVINCE_CAPACITY, ZONE_CAPACITY } from '../../../../data/constants/capacity-type';
import { IMAGE_URL } from '../../../../data/constants/image-url';
@Component({
  selector: 'ngx-province-card',
  templateUrl: './province-card.component.html',
  styleUrls: ['./province-card.component.scss'],
})
export class ProvinceCardComponent implements OnInit {
  @Input() capacity: ProvinceCapacityModel;
  imgUrl = IMAGE_URL;
  provinceCapacityType = PROVINCE_CAPACITY;
  zoneCapacityType = ZONE_CAPACITY;
  public capacityType;
  constructor() { }
  ngOnInit(): void {
  }
  setCapacityType(type) {
    this.capacityType = type;
  }
}
