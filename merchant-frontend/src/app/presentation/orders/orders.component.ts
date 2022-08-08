import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { ORDER_TABS } from 'src/app/presentation/shared/constants/tabs';
import { Country } from 'src/app/presentation/shared/interfaces/countries';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { OrderService } from 'src/app/presentation/shared/services/order.service';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { ProfileService } from 'src/app/presentation/shared/services/profile.service';
import { UtilityService } from 'src/app/presentation/shared/services/utility.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public orders: any[] = [];
  public childOrders: any[] = [];
  public allOrdersExtract: any[] = [];
  public loading = false;
  public filterObject = {} as {
    status: string;
    orderId: string;
    taagerId: string;
    fromDate: string;
    toDate: string;
    country: string;
  };
  public maxItemPerPage = 12;
  public showBoundaryLinks = true;
  public currentPage = 1;
  public showPagination: boolean;
  public noOfItems: number;
  public isMobile: boolean;
  public searchKey = '';
  public showAllOrders = true;
  public showVerifiedOrders = false;
  public ordersTabs = ORDER_TABS;
  public ordersTabsArray = [
    ORDER_TABS.ALL_ORDERS_TAB,
    ORDER_TABS.CURRENT_ORDERS_TAB,
    ORDER_TABS.PREVIOUS_ORDERS_TAB,
    ORDER_TABS.CHILD_ORDERS_TAB,
  ];
  public activeOrdersTab;
  public countries: Country[] = [];
  public isMultitenancyEnabled: boolean;
  public triggerFilterReset: Subject<boolean> = new Subject();

  constructor(
    private profileService: ProfileService,
    private mixpanelService: MixpanelService,
    private orderService: OrderService,
    private responsiveService: ResponsiveService,
    private routes: ActivatedRoute,
    private utilityService: UtilityService,
    private localStorageService: LocalStorageService,
    private multitenancyService: MultitenancyService,
  ) { }

  ngOnInit(): void {
    this.getIsMobile();
    if (this.isMobile) {
      this.maxItemPerPage = 3;
    }
    this.multitenancyService.getSupportedCountries().then(
      countries => this.countries = countries
    );
    this.isMultitenancyEnabled = this.multitenancyService.isMultitenancyEnabled();
    this.checkOrderIdRouteParams();
    this.getOrders();
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  checkOrderIdRouteParams() {
    const {orderId, taagerId} = this.routes.snapshot.params;

    if(orderId && taagerId) {
      this.filterObject.orderId = `${taagerId}/${orderId}`;
      if(/^[MSR]/.test(orderId)) {
        this.switchTab(ORDER_TABS.CHILD_ORDERS_TAB);
      } else {
        this.switchTab(ORDER_TABS.ALL_ORDERS_TAB);
      }
    } else {
      this.switchTab(ORDER_TABS.ALL_ORDERS_TAB);
    }

  }

  public switchTab(tabName) {
    switch (tabName) {
      case ORDER_TABS.ALL_ORDERS_TAB:
        this.showAllOrders = true;
        this.showVerifiedOrders = null;
        this.activeOrdersTab = ORDER_TABS.ALL_ORDERS_TAB;
        break;
      case ORDER_TABS.CURRENT_ORDERS_TAB:
        this.showAllOrders = false;
        this.showVerifiedOrders = false;
        this.activeOrdersTab = ORDER_TABS.CURRENT_ORDERS_TAB;
        break;
      case ORDER_TABS.PREVIOUS_ORDERS_TAB:
        this.showAllOrders = false;
        this.showVerifiedOrders = true;
        this.activeOrdersTab = ORDER_TABS.PREVIOUS_ORDERS_TAB;
        break;
      case ORDER_TABS.CHILD_ORDERS_TAB:
        this.activeOrdersTab = ORDER_TABS.CHILD_ORDERS_TAB;
        break;
    }
  }

  public orderTabClicked(tabName) {
    if(this.activeOrdersTab !== tabName) {
      this.currentPage = 1;
      this.resetFilterObject();
      this.switchTab(tabName);
      this.getOrders();
    }
  }

  public extractArray(orders) {
    if (this.activeOrdersTab !== ORDER_TABS.CHILD_ORDERS_TAB) {
      var keys = [
        'orderID',
        'receiverName',
        'status',
        'createdAt',
        'updatedAt',
        'productIds',
        'productQuantities',
        'productPrices',
        'phoneNumber',
        'receiverName',
        'streetName',
        'province',
        'cashOnDelivery',
        'productProfits',
        'deliverySuspendedReason',
        'failedAttemptNote',
        'suspendedReason',
        'customerRejectedReason',
        'notes',
        'country',
      ];
    } else {
      var keys = [
        'orderID',
        'parentOrderId',
        'orderIssueID',
        'product.name',
        'product.productQty',
        'product.productId',
        'product.productProfit',
        'product.productPrice',
        'status',
        'receiverName',
        'province',
        'streetName',
        'zone.name',
        'phoneNumber',
        'phoneNumber2',
        'cashOnDelivery',
        'pickupDate',
        'deliverySuspendedReason',
        'deliveryDate',
        'notes',
        'country',
      ];
    }
    const extractArray = [];
    extractArray.push(keys.map(key => key.split('.')[key.split('.').length - 1]));
    orders.map(async (order) => {
      const subArray = [];
      await keys.forEach((key, index) => {
        if (key.split('.').length === 2) {
          if (order[key.split('.')[0]][key.split('.')[1]]) {
subArray.push(order[key.split('.')[0]][key.split('.')[1]].toString().replace(',', ''));
} else {
subArray.push('');
}
        } else {
          if (order[key]) {
subArray.push(order[key].toString().replace(',', ''));
} else {
subArray.push('');
}
        }
        if (index == keys.length - 1) {
          extractArray.push(subArray);
        }
      });
    });
    this.utilityService.extractToExcel(extractArray, 'orders.csv');
  }
  public viewMyOrdersExtract(): void {
    this.mixpanelService.track('Order_extract_excel');
    if (this.activeOrdersTab !== ORDER_TABS.CHILD_ORDERS_TAB) {
      const filter = {
        showAllOrders: true,
        ...this.filterObject,
      };
      this.profileService.getUserOrdersExtract(filter).subscribe(
        async (res: any) => {
          this.allOrdersExtract = res.data;
          this.allOrdersExtract = this.allOrdersExtract.reduce((acc, order) => {
            const templateOrder = { ...order };
            order.productIds.forEach((prod, idx) => {
              templateOrder.productIds = order.productIds[idx];
              templateOrder.productQuantities = order.productQuantities[idx];
              templateOrder.productPrices = order.productPrices[idx];
              templateOrder.productProfits = order.productProfits[idx];
              acc.push({ ...templateOrder });
            });
            return acc;
          }, []);
          this.extractArray(this.allOrdersExtract);
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      const filter = {
        ...this.filterObject,
        taagerID: this.localStorageService.getUser().TagerID,
      };
      this.orderService.getChildOrders({ pageSize: 10000, pageNum: 1, filter })
        .subscribe(
          async (res: any) => {
            this.extractArray(res.data);
          },
          (err) => {
          });
    }
  }

  pageChanged(event): void {
    this.currentPage = event.page;
    this.getOrders();
  }

  onSearchClicked(orderFilters) {
    this.filterObject = {...orderFilters};
    this.searchKey = orderFilters.searchKey;
    this.getOrders();
  }

  getOrders(): void {
    this.orders = [];
    this.childOrders = [];
    if (this.activeOrdersTab !== ORDER_TABS.CHILD_ORDERS_TAB) {
      this.getUserOrders();
    } else {
      this.getUserChildOrders();
    }
  }

  getUserOrders(): void {
    if(this.searchKey) {
      this.switchTab(ORDER_TABS.ALL_ORDERS_TAB);
      this.searchUserOrdersByKey();
    } else {
      this.searchUserOrders();
    }
  }

  getUserChildOrders(): void {
    if(this.searchKey) {
      this.searchChildOrdersByKey();
    } else {
      this.searchChildOrders();
    }
  }

  searchUserOrdersByKey(): void {
    this.profileService.searchInUserOrders(this.maxItemPerPage, this.currentPage, this.searchKey)
    .subscribe(res => {
      this.orders = res.data;
      this.noOfItems = res.count;
      this.showPagination = !!res.count;
      this.trackOrdersSearch(res.count);
    });
  }

  searchChildOrdersByKey(): void {
    this.profileService.searchInUserChildOrders({ pageSize: this.maxItemPerPage, pageNum: this.currentPage, searchKey: this.searchKey })
      .subscribe(res => {
        this.childOrders = res.data;
        this.noOfItems = res.count;
        this.showPagination = res.count ? true : false;
      });
  }

  searchUserOrders(): void {
    const ordersFilter = {
      showAllOrders: this.showAllOrders,
      isOrderVerified: this.showVerifiedOrders,
      ...this.filterObject,
    };
    this.profileService.getUserOrders(this.maxItemPerPage, this.currentPage, ordersFilter)
      .subscribe(res => {
        this.orders = res.data;
        this.noOfItems = res.count;
        this.showPagination = res.count ? true : false;
        this.trackOrdersSearch(res.count);
      });
  }

  searchChildOrders(): void {
    const user = this.localStorageService.getUser();
    const childOrdersFilter = {
      showAllOrders: this.showAllOrders,
      isOrderVerified: this.showVerifiedOrders,
      taagerID: user.TagerID,
      ...this.filterObject,
    };
    this.orderService.getChildOrders({ pageSize: this.maxItemPerPage, pageNum: this.currentPage, filter: childOrdersFilter })
    .subscribe((res: any) => {
        this.childOrders = res.data;
        this.showPagination = res.count ? true : false;
        this.noOfItems = res.count;
      },
      (err) => {
      }
    );
  }

  trackOrdersSearch(orderCount): void {
    const {country, status, orderId, fromDate, toDate} = this.filterObject;

    if(this.searchKey) {
      this.mixpanelService.track('Order_search_bar', {
        Keyword: this.searchKey,
        'Orders Available': orderCount,
      });
    } else if (country || status || orderId || fromDate || toDate) {
      this.mixpanelService.track('Order_search_button', {
        country,
        'Order Status': status,
        'Order Id': orderId,
        'From Date': String(fromDate),
        'To Date': String(toDate),
        'Orders Available': orderCount,
      });
    }
  }

  resetFilterObject(): void {
    for(const key in this.filterObject) {
      this.filterObject[key] = null;
      this.triggerFilterReset.next(true);
    }
  }
}


