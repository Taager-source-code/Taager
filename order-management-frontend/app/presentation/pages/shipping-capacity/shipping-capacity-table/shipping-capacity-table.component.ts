import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

import { ProvinceZoneModel } from '../../../../core/domain/province.model';
import {
  ProvinceShippingCompanyModel,
  ProvinceShippingCompanyPriorityModel,
  ProvinceShippingCompanyPriorityUpdateModel,
  ShippingCompanyCapacityModel,
  ShippingCompanyModel,
  ShippingCompanyPriorityModel,
  ZoneShippingCompanyPriorityModel } from '../../../../core/domain/shippingCompany';
import {
  CreateProvinceShippingCompanyUseCase,
} from '../../../../core/usecases/capacity-module/create-province-shipping-company.usecase';
import {
  CreateZoneShippingCompanyUseCase,
} from '../../../../core/usecases/capacity-module/create-zone-shipping-company.usecase';
import {
  DeleteProvinceShippingCompanyPriorityUseCase,
} from '../../../../core/usecases/capacity-module/delete-province-sc-priority.usecase';
import {
  DeleteZoneShippingCompanyPriorityUseCase,
} from '../../../../core/usecases/capacity-module/delete-zone-sc-priority.usecase';
import {
  GetProvinceShippingCompanyPrioritiesUseCase,
} from '../../../../core/usecases/capacity-module/get-province-sc-priorities.usecase';
import { GetShippingCompaniesUseCase } from '../../../../core/usecases/capacity-module/get-shipping-companies.usecase';
import {
  GetZoneShippingCompanyPrioritiesUseCase,
} from '../../../../core/usecases/capacity-module/get-zone-sc-priorities';
import {
  UpdateProvinceShippingCompanyUseCase,
} from '../../../../core/usecases/capacity-module/update-province-shipping-company.usecase';
import {
  UpdateZoneShippingCompanyUseCase,
} from '../../../../core/usecases/capacity-module/update-zone-shipping-company.usecase';
import { capacityMode, PROVINCE_LEVEL, ZONE_CAPACITY } from '../../../../data/constants/capacity-type';
import { IMAGE_URL } from '../../../../data/constants/image-url';
import {
  ChangeEventArgs,
  ProvinceChangeArgs,
  ShippingCompanyPriorityModelEvent,
} from '../../../../data/constants/event-types';
import { LoaderService } from '../../../@core/utils/loader.service';
import { MyToastService } from '../../../@core/utils/myToast.service';
import {
UpdateProvinceShippingCompanyPriorityUseCase,
} from '../../../../core/usecases/capacity-module/update-province-sc-priority.usecase';
import {
  UpdateZoneShippingCompanyPriorityUseCase,
} from '../../../../core/usecases/capacity-module/update-zone-sc-priority.usecase';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'ngx-shipping-capacity-table',
  templateUrl: './shipping-capacity-table.component.html',
  styleUrls: ['./shipping-capacity-table.component.scss'],
})
export class ShippingCapacityTableComponent implements OnInit {
  @Input() capacityType;
  @Input() provinceId: string;
  @Input() zoneData: ProvinceZoneModel;
  zoneCapacityType = ZONE_CAPACITY;
  imgUrl = IMAGE_URL;
  priorityForm: FormGroup;
  addPriorityRowVisible = false;
  provinceShippingCompaniesPriority: ProvinceShippingCompanyPriorityModel[];
  zoneShippingCompaniesPriority: ZoneShippingCompanyPriorityModel[];
  shippingCompanyList: ShippingCompanyModel[];
  formValue: FormArray;
  provinceShippingCompanyPriorityForm: FormGroup;
  zoneShippingCompanyPriorityForm: FormGroup;
  cutOffTimeFormat = 'hh:mm a';
  capacityMode = capacityMode;
  province_level = PROVINCE_LEVEL;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: MyToastService,
    private getShippingCompaniesUseCase: GetShippingCompaniesUseCase,
    private getProvinceShippingCompanyPrioritiesUseCase: GetProvinceShippingCompanyPrioritiesUseCase,
    private getZoneShippingCompanyPrioritiesUseCase: GetZoneShippingCompanyPrioritiesUseCase,
    private createProvinceShippingCompanyUseCase: CreateProvinceShippingCompanyUseCase,
    private createZoneShippingCompanyUseCase: CreateZoneShippingCompanyUseCase,
    private loaderService: LoaderService,
    private deleteProvinceShippingCompanyPriorityUseCase: DeleteProvinceShippingCompanyPriorityUseCase,
    private deleteZoneShippingCompanyPriorityUseCase: DeleteZoneShippingCompanyPriorityUseCase,
    private updateProvinceShippingCompanyUseCase: UpdateProvinceShippingCompanyUseCase,
    private updateZoneShippingCompanyUseCase: UpdateZoneShippingCompanyUseCase,
    private updateProvinceShippingCompanyPriorityUseCase: UpdateProvinceShippingCompanyPriorityUseCase,
    private updateZoneShippingCompanyPriorityUseCase: UpdateZoneShippingCompanyPriorityUseCase,
    ) {
      this.priorityForm = this.formBuilder.group({
        shippingCompanies: this.formBuilder.array([]),
      });
    this.formValue = this.priorityForm.get('shippingCompanies') as FormArray;
   }
  ngOnInit(): void {
    this.provinceShippingCompanyPriorityFormInit();
    this.zoneShippingCompanyPriorityFormInit();
    this.loadShippingCompanyPriority();
  }
  provinceShippingCompanyPriorityFormInit(): void{
   this.provinceShippingCompanyPriorityForm = this.formBuilder.group({
    companyId: '',
    capacityMode: 'province-level',
    capacity: 0,
    cutOffTime: '10:00 PM',
   });
  }
  zoneShippingCompanyPriorityFormInit(): void{
    this.zoneShippingCompanyPriorityForm = this.formBuilder.group({
      provincePriorityId: '',
      capacity: 0,
    });
  }
  fetchShippingCompaniesList(): void{
    if(!this.shippingCompanyList){
      this.getShippingCompaniesUseCase.execute().subscribe(
        (res)=>{
          this.shippingCompanyList = res;
        },
        (err)=>{
          this.toastService.showToast('Error', err, 'error');
        },
        ()=>{},
      );
    }
  }
  loadShippingCompanyPriority(): void{
    if(this.capacityType === this.zoneCapacityType){
      this.fetchZoneShippingCompanyPrioritiesList();
    } else {
      this.fetchProvinceShippingCompanyPrioritiesList();
    }
  }
  fetchProvinceShippingCompanyPrioritiesList(type?: string){
    if(!this.provinceShippingCompaniesPriority || type !== 'fetch'){
      this.getProvinceShippingCompanyPrioritiesUseCase.execute(this.provinceId).subscribe(
        (res)=>{
          this.provinceShippingCompaniesPriority = res;
        },
        (err)=>{
          this.toastService.showToast('Error', err, 'error');
        },
        ()=>{
            if(type !== 'fetch'){
              this.provinceShippingCompaniesPriority.forEach((element,index) => {
                this.addNewShippingCompany(element,index);
              });
            }
        },
      );
    }
  }
  fetchZoneShippingCompanyPrioritiesList(): void{
    const params = {
      provinceId: this.provinceId,
      zoneId: this.zoneData.zoneId,
    };
    this.getZoneShippingCompanyPrioritiesUseCase.execute(params).subscribe(
      (res)=>{
        this.zoneShippingCompaniesPriority = res;
      },
      (err)=>{},
      ()=>{
        this.zoneShippingCompaniesPriority.forEach((element,index) => {
          this.addNewShippingCompany(element,index);
        });
      },
    );
  }
  shippingCompaniesFA(): FormArray {
    return this.priorityForm.get('shippingCompanies') as FormArray;
  }
  createShippingCompanyFormGroup(value?: ProvinceShippingCompanyPriorityModel, index?): FormGroup {
    return this.formBuilder.group({
      priority: value?index:0,
      priorityId: value?value.priorityId:'',
      shippingCompany: value?value.companyName:'',
      capacityPerDay: value?value.capacity:'',
      capacityMode: value?value.capacityMode:'',
      inTesting: value?value.inTesting:false,
      capacityValue:value?value.capacity:'',
      capacityRemaining: value?value.remainingCapacity:'',
      cutOffTime: value?value.cutOffTime:'',
      editActive: false,
    });
  }


  addPriorityRow(){
    this.addPriorityRowVisible = true;
  }
  addNewShippingCompany(event, index?: number): void{
    this.shippingCompaniesFA().push(this.createShippingCompanyFormGroup(event, index));
  }
  setProvinceShippingCompany(event: ProvinceChangeArgs): void{
    let companyValue;
    if(event.value !== null) {
      companyValue = event.itemData.companyId;
    } else {
      companyValue = '';
    }
    this.provinceShippingCompanyPriorityForm.get('companyId').setValue(companyValue);
  }
  setZoneShippingCompany(event: ChangeEventArgs): void{
    this.zoneShippingCompanyPriorityForm.get('provincePriorityId').setValue(event.value);
  }
  capacityValueSet(event: ChangeEventArgs, type: string){
    if(type === this.zoneCapacityType) {
      this.zoneShippingCompanyPriorityForm.get('capacity').setValue(event.value);
    } else {
      this.provinceShippingCompanyPriorityForm.get('capacity').setValue(event.value);
    }
  }
  cutOffTimeValueSet(event: ChangeEventArgs){
    this.provinceShippingCompanyPriorityForm.get('cutOffTime').setValue(event.text);
  }
  submitNewCompany(type: string): void{
    let myForm;
    let shippingCompany;
    if(type === this.zoneCapacityType) {
      myForm = this.zoneShippingCompanyPriorityForm.value;
      shippingCompany = myForm.provincePriorityId;
    } else {
      myForm = this.provinceShippingCompanyPriorityForm.value;
      shippingCompany = myForm.companyId;
    }
   if(
     shippingCompany === ''){
      this.toastService.showToast('Error', 'Shipping Company must be selected.', 'error');
    } else if(myForm.capacity === 0 && myForm.capacityMode === 'province-level'){
      this.toastService.showToast('Error', 'Capacity can not be 0.', 'error');
    } else {
      if(type === this.zoneCapacityType) {
        this.addShippingCompanyToZone();
      } else {
        this.addShippingCompanyToProvince();
      }
    }
  }
  addShippingCompanyToProvince(): void{
    const params = {
      provinceId: this.provinceId,
      data: this.provinceShippingCompanyPriorityForm.value,
    };
    this.loaderService.showSpinner();
    this.createProvinceShippingCompanyUseCase.execute(params).pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (res)=>{},
      (err)=>{
        this.toastService.showToast('Error', err.error?.message, 'error');
      },
      ()=>{
        this.addPriorityRowVisible = false;
        this.shippingCompaniesFA().clear();
        this.fetchProvinceShippingCompanyPrioritiesList('refresh');
        this.toastService.showToast('Success', 'Shipping Company added Successfully', 'success');
      },
    );
  }
  addShippingCompanyToZone(): void{
    const params = {
      provinceId: this.provinceId,
      zoneId: this.zoneData.zoneId,
      data: this.zoneShippingCompanyPriorityForm.value,
    };
    this.loaderService.showSpinner();
    this.createZoneShippingCompanyUseCase.execute(params).pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (res)=>{},
      (err)=>{
        this.toastService.showToast('Error', err.error?.message, 'error');
      },
      ()=>{
        this.addPriorityRowVisible = false;
        this.shippingCompaniesFA().clear();
        this.fetchZoneShippingCompanyPrioritiesList();
        this.toastService.showToast('Success', 'Shipping Company added Successfully', 'success');
      },
    );
  }
  removePriorityRow(): void{
    this.addPriorityRowVisible = false;
  }
  drop(event: CdkDragDrop<string[]>) {
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.moveItemInFormArray(from, to);
  }
   moveItemInFormArray(moveFromIndex: number, moveToIndex: number): void {
    const from = this.clamp(moveFromIndex, this.formValue.length - 1);
    const to = this.clamp(moveToIndex, this.formValue.length - 1);
    if (from === to) {
      return;
    }
    const previous = this.formValue.at(from);
    const current = this.formValue.at(to);
    this.formValue.setControl(to, previous);
    this.formValue.setControl(from, current);
  }

  /** Clamps a number between zero and a maximum. */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }

  editRow(index: number, value: boolean): void{
    const editValue = !value;
    this.shippingCompaniesFA().at(index).get('editActive').setValue(editValue);
  }
  setCutOffTime(event: ChangeEventArgs, index: number): void{
    this.shippingCompaniesFA().at(index).get('cutOffTime').setValue(event.text);
  }
  cancelEditAll(): void{
    this.formValue.value.forEach((element, index) => {
      this.shippingCompaniesFA().at(index).get('editActive').setValue(false);
    });
  }
  editCapacityValue(event: ChangeEventArgs, index: number): void{
    this.shippingCompaniesFA().at(index).get('capacityValue').setValue(event.value);
  }
  capacityModeValueSet(event: ChangeEventArgs): void{
    this.provinceShippingCompanyPriorityForm.get('capacityMode').setValue(event.value);
  }
  inTestingValueSet(index: number): void{
    this.shippingCompaniesFA().at(index).get('inTesting').setValue(true);
  }
  editActiveValueSet(index){
    this.shippingCompaniesFA().at(index).get('editActive').setValue(false);
}
  applyEdit(): void{
    this.formValue.value.forEach((element,index) => {
      this.shippingCompaniesFA().at(index).get('editActive').setValue(false);
    });
    this.toastService.showToast('Success', 'Changes applied successfully', 'success');
  }
  editSelectedPriority(event: ShippingCompanyPriorityModelEvent, type: string): void{
    if(type === this.zoneCapacityType){
      this.updateSelectedZoneShippingCompany(event);
    } else {
      this.updateSelectedProvinceShippingCompany(event);
    }
  }
  updateSelectedProvinceShippingCompany(event: ShippingCompanyPriorityModelEvent): void{
    const data: ProvinceShippingCompanyModel = {
      capacityMode: event.capacityMode,
      capacity: event.capacityMode === PROVINCE_LEVEL?event.capacityValue:null,
      cutOffTime: event.cutOffTime,
    };
    const params = {
      provinceId: this.provinceId,
      priorityId: event.priorityId,
      data,
    };
    this.loaderService.showSpinner();
    this.updateProvinceShippingCompanyUseCase.execute(params).subscribe(
      (res)=>{},
      (err)=>{
        this.toastService.showToast('Error', err.error.message, 'error');
        this.loaderService.hideSpinner();
      },
      ()=>{
        this.shippingCompaniesFA().clear();
        this.fetchProvinceShippingCompanyPrioritiesList('refresh');
        this.loaderService.hideSpinner();
        this.toastService.showToast('Updated', 'Shipping Company updated Successfully', 'info');
      },
    );
  }
  updateSelectedZoneShippingCompany(event: ShippingCompanyPriorityModelEvent){
    const data: ShippingCompanyCapacityModel = {
      capacity:  event.capacityValue,
      inTesting: event.inTesting,
    };
    const params = {
      provinceId: this.provinceId,
      zoneId: this.zoneData.zoneId,
      priorityId: event.priorityId,
      data,
    };
    this.loaderService.showSpinner();
    this.updateZoneShippingCompanyUseCase.execute(params).subscribe(
      (res)=>{},
      (err)=>{
        this.toastService.showToast('Error', err.error?.message, 'error');
        this.loaderService.hideSpinner();
      },
      ()=>{
        this.shippingCompaniesFA().clear();
        this.fetchZoneShippingCompanyPrioritiesList();
        this.loaderService.hideSpinner();
        this.toastService.showToast('Updated', 'Shipping Company updated Successfully', 'info');
      },
    );
  }
  updatePriorities(): void{
    if(this.capacityType === this.zoneCapacityType){
      this.updateZonePriorities();
    } else {
      this.updateProvincePriorities();
    }
  }
  updateProvincePriorities(resetZones: boolean = false): void{
    const priorityIds = this.formValue.value.map(x=> ({priorityId: x.priorityId}));
    const data: ProvinceShippingCompanyPriorityUpdateModel = {
     resetZones,
     priorities: priorityIds,
    };
    const params = {
      provinceId: this.provinceId,
      data,
    };
    this.loaderService.showSpinner();
    this.updateProvinceShippingCompanyPriorityUseCase.execute(params).subscribe(
      (res)=>{},
      (err)=>{
       this.toastService.showToast('Error', err.error?.message, 'error');
       this.loaderService.hideSpinner();
      },
      ()=>{
       this.shippingCompaniesFA().clear();
       this.fetchProvinceShippingCompanyPrioritiesList();
       this.loaderService.hideSpinner();
       this.toastService.showToast('Priority Updated', 'Shipping Company priority updated successfully', 'info');
      },
    );
   }

   updateZonePriorities(){
    const priorityIds: ShippingCompanyPriorityModel[] = this.formValue.value.map(x=> ({priorityId: x.priorityId}));
    const params = {
      provinceId: this.provinceId,
      zoneId: this.zoneData.zoneId,
      data: priorityIds,
    };
    this.loaderService.showSpinner();
    this.updateZoneShippingCompanyPriorityUseCase.execute(params).subscribe(
      (res)=>{},
      (err)=>{
        this.toastService.showToast('Error', err.error?.message, 'error');
        this.loaderService.hideSpinner();
      },
      ()=>{
        this.shippingCompaniesFA().clear();
        this.fetchZoneShippingCompanyPrioritiesList();
        this.loaderService.hideSpinner();
        this.toastService.showToast('Priority Updated', 'Shipping Company priority updated successfully', 'info');
      },
    );
   }

  removeShippingCompany(companyIndex: number): void {
    this.shippingCompaniesFA().removeAt(companyIndex);
  }
  removeShippingCompanyPriority(event: ProvinceShippingCompanyPriorityModel){
    Swal.fire({
      title: 'Are you sure?',
      text: 'The selected shipping company priority will be deleted permanently. Please confirm to proceed.',
      icon: 'warning',
      iconColor: '#13aca0',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      backdrop: false,
      confirmButtonColor: '#13aca0',
    }).then((result) => {
      if (result.value) {
        this.deleteShippingCompanyPriority(event);
      }
    });
  }
  deleteShippingCompanyPriority(event: ProvinceShippingCompanyPriorityModel): void{
    this.loaderService.showSpinner();
    if(this.capacityType === this.zoneCapacityType){
      const params = {
        provinceId: this.provinceId,
        zoneId: this.zoneData.zoneId,
        priorityId: event.priorityId,
      };
      this.deleteZoneShippingCompanyPriorityUseCase.execute(params).subscribe(
        (res)=>{},
        (err)=>{
          this.loaderService.hideSpinner();
        },
        ()=>{
          Swal.fire('Deleted!', 'Shipping Company deleted successfully', 'success');
          this.shippingCompaniesFA().clear();
          this.fetchZoneShippingCompanyPrioritiesList();
          this.loaderService.hideSpinner();
        },
      );
    } else {
      const params= {
        provinceId: this.provinceId,
        priorityId: event.priorityId,
      };
      this.deleteProvinceShippingCompanyPriorityUseCase.execute(params).subscribe(
        (res)=>{},
        (err)=>{
          this.loaderService.hideSpinner();
        },
        ()=>{
          this.shippingCompaniesFA().clear();
          this.fetchProvinceShippingCompanyPrioritiesList('refresh');
          this.loaderService.hideSpinner();
        },
      );
    }
  }

}
