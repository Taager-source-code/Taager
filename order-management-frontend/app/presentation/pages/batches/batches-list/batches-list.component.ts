import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckBoxSelectionService, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { BatchForm } from '../../../shared/forms/batchForm.service';
import { formatDate } from '@angular/common';
import { SharedAPIService } from '../../../shared/shared-apis/sharedapi.service';
import { tableSettings } from '../../../@core/utils/table-settings';
import Swal from 'sweetalert2';
import { NbPopoverDirective } from '@nebular/theme';
@Component({
  selector: 'ngx-batches-list',
  templateUrl: './batches-list.component.html',
  styleUrls: ['./batches-list.component.scss'],
  providers: [CheckBoxSelectionService],
})
export class BatchesListComponent implements OnInit {
  @ViewChild('batchQuantityObj') batchQuantityObject: DropDownListComponent;
  @ViewChild('shippingCompanyObj') shippingCompanyObject: DropDownListComponent;
  @ViewChild('categoryDropDown') categoryDropDown: DropDownListComponent;
  @ViewChild('provinceDropDown') provinceDropDown: DropDownListComponent;
  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('orderSidebar') orderSidebar: SidebarComponent;
  @ViewChild('ejsGrid') ejsGrid: GridComponent;
  @ViewChild(NbPopoverDirective) popover;
  tableSettings = tableSettings.pageSettings;
  tableData;
  batchList;
  mode: string;
  selectedOrder;
  constructor(
    public batchForm: BatchForm,
    public sharedData: SharedAPIService,
  ) {
    this.batchForm.searchFiltersInit();
  }
  get form(): FormGroup {
    return this.batchForm.batchForm;
  }
  refreshData() {
    if (this.ejsGrid) {
      this.ejsGrid.refresh();
    }
  }
  ngOnInit() {
    this.mode = 'CheckBox';
    this.batchForm.fetchBatch();
    this.tableData = {
      result: [],
      count: 0,
    };
    this.batchForm.batchList$.subscribe(
      (res) => {
        this.tableData = {
          result: res.batchList,
          count: res.count,
        };
      },
    );
  }
  filterSearch(event, attribute) {
    const value = event.value === 'All' ? null : event.value;
    this.batchForm.searchFormGroup.controls[attribute].setValue(value);
    this.batchForm.fetchBatch();
  }
  clearSearch(type?) {
    if(type === 'batchId'){
      this.batchForm.searchFormGroup.controls.batchId.setValue(null);
    } else if(type === 'orderId'){
      this.batchForm.searchFormGroup.controls.orderId.setValue(null);
    }
    this.batchForm.fetchBatch();
  }
  pageChange(event) {
    const obj = {
      pageSize: this.ejsGrid.pageSettings.pageSize,
      page: this.ejsGrid.pageSettings.currentPage,
    };
    if (event.requestType === 'paging') {
      this.batchForm.searchFormGroup.controls.page.setValue(obj.page);
      this.batchForm.searchFormGroup.controls.pageSize.setValue(obj.pageSize);
      this.batchForm.fetchBatch();
    }
  }
  toggleClick(): void {
    this.sidebar.show();
    this.sharedData.batchCategory[0].active = false;
    this.sharedData.batchCategory[1].active = false;
  }
  closeSideBar() {
    this.sidebar.hide();
  }
  async onSubmit() {
    const fromDateValue = formatDate(this.form.value.fromDate, 'yyyy-MM-dd', 'en-US');
    const toDateValue = formatDate(this.form.value.toDate, 'yyyy-MM-dd', 'en-US');
    const obj = {
      fromDate: fromDateValue,
      toDate: toDateValue,
      category: this.form.value.batchCategory,
      orderGrouping: this.form.value.batchQuantity,
      maxOrdersAllowed: this.form.value.cap,
      checkPreferredDeliveryDate: false,
      shipping: {
        company: this.form.value.shippingCompany,
        province: this.form.value.province,
        zone: this.form.value.zone,
      },
    };
    await this.batchForm.createBatch(obj);
    this.sidebar.hide();
    this.ejsGrid.refresh();
  }
  showOrderSidebar(data) {
    this.popover.hide();
    this.selectedOrder = data;
    this.orderSidebar.show();
  }
  closeOrderSideBar() {
    this.orderSidebar.hide();
  }
  deleteBatch(id) {
    this.popover.hide();
    Swal.fire({
      title: 'Are you sure?',
      text: 'The selected batch will be deleted permanently. Please confirm to proceed.',
      icon: 'warning',
      iconColor: '#13aca0',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      backdrop: false,
      confirmButtonColor: '#13aca0',
    }).then(async (result) => {
      if (result.value) {
        await this.batchForm.deleteBatch(id);
        Swal.fire('Deleted!', 'Batch deleted successfully', 'success');
        this.ejsGrid.refresh();
      }
    });
  }
}
