import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BatchForm } from '../../forms/batchForm.service';
import { SharedAPIService } from '../../shared-apis/sharedapi.service';
@Component({
  selector: 'create-batch-form',
  templateUrl: './create-batch-form.component.html',
  styleUrls: ['./create-batch-form.component.scss'],
})
export class CreateBatchFormComponent implements OnInit {
  @Input() shippingCompany;
  activeZones;
  todayDate: Date = new Date();
  constructor(
    public batchForm: BatchForm,
    public sharedData: SharedAPIService,
  ) { }
  get form(): FormGroup {
    return this.batchForm.batchForm;
  }
  ngOnInit() {
    this.batchForm.init();
  }
  getProvince(event) {
    this.activeZones = event.itemData.greenZones;
  }
  selectBatchCategory(arg) {
    if (arg === 'fashion') {
      this.sharedData.batchCategory[0].active = true;
      this.sharedData.batchCategory[1].active = false;
    } else {
      this.sharedData.batchCategory[1].active = true;
      this.sharedData.batchCategory[0].active = false;
    }
    this.batchForm.batchForm.controls.batchCategory.setValue(arg);
  }
  selectBatchQuantity(arg) {
    if (arg === 'single_item') {
      this.sharedData.batchQuantityType[0].active = true;
      this.sharedData.batchQuantityType[1].active = false;
    } else {
      this.sharedData.batchQuantityType[1].active = true;
      this.sharedData.batchQuantityType[0].active = false;
    }
    this.batchForm.batchForm.controls.batchQuantity.setValue(arg);
  }
}
