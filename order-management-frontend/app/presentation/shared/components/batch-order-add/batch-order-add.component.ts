import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MyToastService } from '../../../@core/utils/myToast.service';
import { tableSettings } from '../../../@core/utils/table-settings';
import { BatchAPIService } from '../../../services/batch.service';
import { SharedAPIService } from '../../shared-apis/sharedapi.service';
import { ORDER_FILE_NAME } from '@data/constants/unAllocateFile';
import { COLOR_VARIANTS } from '@data/constants/color-variants';
@Component({
  selector: 'batch-order-add',
  templateUrl: './batch-order-add.component.html',
  styleUrls: ['./batch-order-add.component.scss'],
})
export class BatchOrderAddComponent implements OnInit, OnChanges {
  @Input() categories;
  @Input() data;
  @Input() pageSettings;
  @ViewChild('ejsGrid') ejsGrid: GridComponent;
  // @ViewChild('ordersListMS') ordersListMS: MultiSelectComponent;
  orderId;
  paramsFormGroup: FormGroup;
  selectedOrderDetails;
  constructor(
    private batchAPI: BatchAPIService,
    private fb: FormBuilder,
    private toast: MyToastService,
    public sharedData: SharedAPIService,
  ) {
    this.paramsFormGroup = this.fb.group({
      page: 1,
      pageSize: tableSettings.pageSettings.pageSize,
    });
  }
  ngOnInit(): void {
  }
  ngOnChanges() {
    this.fetchBatchOrders();
  }
  fetchBatchOrders() {
    this.batchAPI.getBatchOrders(this.data.batchId, this.paramsFormGroup.value).subscribe(
      (res) => {
        this.selectedOrderDetails = res.orders;
      },
      (err) => { },
      () => { },
    );
  }
  pageChange(event) {
    const obj = {
      pageSize: this.ejsGrid.pageSettings.pageSize,
      page: this.ejsGrid.pageSettings.currentPage,
    };
    if (event.requestType === 'paging') {
      this.paramsFormGroup.controls.page.setValue(obj.page);
      this.paramsFormGroup.controls.pageSize.setValue(obj.pageSize);
      this.fetchBatchOrders();
    }
  }
  addOrderId() {
    const obj = {
      orderId: this.orderId,
      action: 'add',
    };
    this.updateBatch(obj, 'Added Successfully');
  }
  removeOrderId(order) {
    const obj = {
      orderId: order.orderID,
      action: 'remove',
    };
    this.updateBatch(obj, 'Removed');
  }
  updateBatch(data, message) {
    const bodyParam = {
      orders: [data],
    };
    this.batchAPI.addOrderToBatch(this.data.batchId, bodyParam).subscribe(
      (res) => { },
      (err) => {
        this.toast.showToast('Error', err.error.msg);
      },
      () => {
        this.toast.showToast('Success', `Order ${message}`);
        this.fetchBatchOrders();
        if (data.action === 'add') {
          this.orderId = null;
        }
      },
    );
  }
  excelExport() {
    this.ejsGrid.excelExport();
  }
  downloadSheet(id) {
    this.batchAPI.getBatchSheet(id).subscribe((res) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + res.body], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const linkElem = document.createElement('a');
      linkElem.href = url;
      linkElem.setAttribute('download', this.data?.batchId);
      linkElem.click();
    },
      (err) => {
        this.toast.showToast('Error', err.error?.msg, 'error');
      },
      () => { },
    );
  }
  generatePicklist(id) {
    this.batchAPI.getPickList(id).subscribe((res) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + res.body], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const linkElem = document.createElement('a');
      linkElem.href = url;
      linkElem.setAttribute('download', 'picklist_'+this.data?.batchId);
      linkElem.click();
    },
      (err) => {
        this.toast.showToast('Error', err.error?.msg, 'error');
      }
    );
  }
}
