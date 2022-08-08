import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryModel } from '@core/domain/country.model';
import { RemoteConfigService } from '@presentation/services/remote-config.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { finalize } from 'rxjs/operators';
import { OrderFilterModel } from '@core/domain/filters-model/order-filter.model';
import { OrderModel, OrderModelStructure } from '@core/domain/order.model';
import { GetOrdersListUseCase } from '@core/usecases/order-module/get-orders-list.usecase';
import {
  ALL_ORDERS_VALUE,
  DELIVERED_STATUS_VALUE,
  OrderFilterByStatus,
  ORDER_DELIVERED_STATUS,
  ORDER_DEVLIVERY_IN_PROGRESS_STATUS,
  PROGRESS_STATUS_VALUE } from '@data/constants/order_status_filter';
import { LoaderService } from '@presentation/@core/utils/loader.service';
import { MyToastService } from '@presentation/@core/utils/myToast.service';
import { tableSettings } from '@presentation/@core/utils/table-settings';
@Component({
  selector: 'ngx-eligible-orders',
  templateUrl: './eligible-orders.component.html',
  styleUrls: ['./eligible-orders.component.scss'],
})
export class EligibleOrdersComponent implements OnInit {
  @ViewChild('ejsGrid') ejsGrid: GridComponent;
  @ViewChild('orderDetails') orderDetailsSidebar: SidebarComponent;
  searchTerm: string;
  tableSettings = tableSettings.pageSettings;
  ordersData: OrderModelStructure;
  selectedOrder: OrderModel;
  paginationSettings = {
    currentPage: 1,
    currentPageSize: tableSettings.pageSettings.pageSize,
  };
  selectedCountry: CountryModel;
  statusFilter: OrderFilterByStatus[] = [
    { name: ALL_ORDERS_VALUE, value: '', active: true },
    { name: DELIVERED_STATUS_VALUE, value: ORDER_DELIVERED_STATUS, active: false },
    { name: PROGRESS_STATUS_VALUE, value: ORDER_DEVLIVERY_IN_PROGRESS_STATUS, active: false },
  ];
  selectedStatus = '';
  constructor(
    private toastr: MyToastService,
    private getOrdersListUseCase: GetOrdersListUseCase,
    private loaderService: LoaderService,
  ) { }
  ngOnInit(): void { }
  fetchOrdersList(): void {
    const params: OrderFilterModel = {
      page: this.paginationSettings.currentPage,
      pageSize: this.paginationSettings.currentPageSize,
      orderId: null,
      customerPhoneNum: null,
      status: this.selectedStatus || null,
      country: this.selectedCountry?.isoCode3 || null,
    };
    if(this.searchTerm){
      if(this.searchTerm.includes('/')){
        params.orderId = this.searchTerm;
      } else {
        params.customerPhoneNum = this.searchTerm;
      }
    }
    this.loaderService.showSpinner();
    this.ordersData = {
      count: 0,
      result: [],
    };
    this.getOrdersListUseCase.execute(params).pipe(finalize(() => {
      this.loaderService.hideSpinner();
    })).subscribe(
      (res) => {
        this.ordersData = {
          count: res.count,
          result: res.result,
        };
      },
      (err) => {
        this.toastr.showToast('Error', 'Error fetching data', 'error');
      },
      () => {
       },
    );
  }
  pageChange(event): void {
    if (event?.requestType === 'paging') {
      this.paginationSettings = {
        currentPage: event.currentPage,
        currentPageSize: this.ejsGrid.pageSettings.pageSize,
      };
      this.fetchOrdersList();
    }
  }
  searchOrders(): void {
    this.paginationSettings.currentPage = 1;
    this.fetchOrdersList();
  }
  changeStatus() {
    if(this.ejsGrid.pageSettings.currentPage !== 1) {
      /* this will trigger pageChange which will reload the table */
      this.ejsGrid.pageSettings.currentPage = 1;
    } else {
      this.fetchOrdersList();
    }
  }
  clearSearch() {
    this.searchTerm = null;
    this.fetchOrdersList();
  }
  onOpenOrderDetails(clickedOrder: OrderModel) {
    this.selectedOrder = clickedOrder;
    this.orderDetailsSidebar.show();
  }
  closeOrderSideBar() {
    this.selectedOrder = null;
    this.orderDetailsSidebar.hide();
  }
  onSelectedCountryChanged(country: CountryModel): void {
    const previousCountry = this.selectedCountry?.isoCode3;
    this.selectedCountry = country;
    if( previousCountry && this.ejsGrid.pageSettings.currentPage !== 1) {
      /* this will trigger pageChange which will reload the table */
      this.ejsGrid.pageSettings.currentPage = 1;
    } else {
      this.fetchOrdersList();
    }
  }
}
