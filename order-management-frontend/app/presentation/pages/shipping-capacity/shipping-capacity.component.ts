import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { finalize } from 'rxjs/operators';
import { ProvinceCapacityModel } from '../../../core/domain/capacity.model';
import { GetProvinceCapacityUseCase } from '../../../core/usecases/capacity-module/get-province-capacity.usecase';
import { LoaderService } from '../../@core/utils/loader.service';
import { AllocationServiceComponent } from './allocation-service/allocation-service.component';
@Component({
  selector: 'ngx-shipping-capacity',
  templateUrl: './shipping-capacity.component.html',
  styleUrls: ['./shipping-capacity.component.scss'],
})
export class ShippingCapacityComponent implements OnInit {
  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('unAllocationSidebar') unAllocationSidebar: SidebarComponent;
  @ViewChild('allocationService', { static: false }) allocationService: AllocationServiceComponent;
  searchTerm: string;
  provinceCapacity: ProvinceCapacityModel[];
  allProvinceList: ProvinceCapacityModel[];
  constructor(
    private getProvinceCapacityUseCase: GetProvinceCapacityUseCase,
    private loaderService: LoaderService,
  ) { }
  ngOnInit(): void {
    this.fetchProvinceList();
  }
  clearSearch() {
    this.searchTerm = null;
  }
  fetchProvinceList() {
    this.loaderService.showSpinner();
    this.getProvinceCapacityUseCase.execute().pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (res) => {
        this.provinceCapacity = res;
        this.allProvinceList = res;
      },
      (err) => { },
      () => { },
    );
  }
  showAllocationServiceSidebar() {
    this.allocationService.getServiceStatus();
    this.sidebar.show();
  }
  showUnAllocationSidebar() {
    this.unAllocationSidebar.show();
  }
  closeSideBar() {
    this.sidebar.hide();
  }
  closeUnAllocationSidebar(){
    this.unAllocationSidebar.hide();
  }
  updateStatus() {
    this.allocationService.updateAllocationServiceStatus();
  }
  searchProvince() {
    if(this.searchTerm?.length === 0){
      this.fetchProvinceList();
    } else {
      this.provinceCapacity = this.allProvinceList.filter(x => x.provinceName === this.searchTerm);
    }
  }
}
