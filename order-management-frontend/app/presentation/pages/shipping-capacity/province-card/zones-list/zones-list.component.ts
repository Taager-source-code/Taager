import { Component, Input, OnInit } from '@angular/core';
import { ProvinceZoneModel } from '../../../../../core/domain/province.model';
import { GetZonesInProvinceUseCase } from '../../../../../core/usecases/capacity-module/get-zones-in-province.usecase';
import { MyToastService } from '../../../../@core/utils/myToast.service';
@Component({
  selector: 'ngx-zones-list',
  templateUrl: './zones-list.component.html',
  styleUrls: ['./zones-list.component.scss'],
})
export class ZonesListComponent implements OnInit {
  @Input() capacityType;
  @Input() provinceId: string;
  zoneList: ProvinceZoneModel[];
  searchResults: ProvinceZoneModel[];
  expandedIndex: number;
  constructor(
    private getZonesInProvinceUseCase: GetZonesInProvinceUseCase,
    private toasterService: MyToastService,
  ) { }
  ngOnInit(): void {
    this.fetchZoneList();
  }
  fetchZoneList(){
    if(!this.zoneList){
      this.getZonesInProvinceUseCase.execute(this.provinceId).subscribe(
        (res)=> {
          this.zoneList = res;
        },
        (err)=>{
          this.toasterService.showToast('Error', err);
        },
        ()=>{
          this.searchResults = this.zoneList;
        },
      );
    }
  }
  showSearchResult(item){
    if(item.itemData !== null){
    const searchItem: ProvinceZoneModel = item.itemData;
    this.searchResults = this.zoneList.filter(zone=> zone.zoneId === searchItem.zoneId);
    } else {
     this.searchResults = this.zoneList;
    }
  }
  setExpandZone(i){
    this.expandedIndex = i;
  }
}
