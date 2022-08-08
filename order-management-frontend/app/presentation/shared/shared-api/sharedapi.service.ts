import { Injectable } from '@angular/core';
import { CommonAPIService } from '../../services/common.service';
@Injectable({
  providedIn: 'root',
})
export class SharedAPIService {
  imgUrl= 'assets';
  sidebarCollapsed = false;
  batchCategory = [
    {value: 'fashion', text:'Fashion', img: '/icons/fashion.svg', active: false},
    {value: 'others', text:'Non-Fashion', img: '/icons/storage-box.svg', active: false},
  ];
  batchQuantityType = [
    {value: 'single_item', text:'Single', img: '/icons/single.svg', active: false},
    {value: 'multi_item', text:'Multiple', img: '/icons/multiple.svg', active: false},
  ];
  allObj = {
    id: null,
    name: 'All',
    location: 'All',
  };
  batchQuantity = [
    { name: 'All', value: null },
    { name: 'Single', value: 'single_item' },
    { name: 'Multiple', value: 'multi_item' },
  ];
  downloadStatus = [
    { name: 'true', value: 'true' },
    { name: 'false', value: 'false' },
  ];
  categoryList;
  provinceList;
  userProfile;
  userRole;
  constructor(
    private commonAPI: CommonAPIService,
  ) { }
  fetchCategories() {
    if (!this.categoryList) {
      this.commonAPI.getCategories().subscribe(
        (res) => {
          this.categoryList = res.data;
          this.categoryList.splice(0, 0, this.allObj);
        },
        (err) => { },
        () => { },
      );
    }
  }
  async fetchProvinces() {
      try {
        if(!this.provinceList){
          const res = await this.commonAPI.getProvinces().toPromise();
          this.provinceList = res.data.filter(x=> x.isActive === true);
        }
       } catch (e) {
         throw e;
       }
  }
  addAllObject(filterSearch){
    const filterAll = this.provinceList.filter(x=> x.location === 'All');
        if(filterSearch && filterAll.length === 0){
          this.provinceList = [this.allObj, ...this.provinceList];
        } else if (!filterSearch) {
          this.provinceList = this.provinceList.filter(x=> x.location !== 'All');
        }
  }
  countryChanged(){
    this.categoryList = undefined;
    this.provinceList = undefined;
  }
}
