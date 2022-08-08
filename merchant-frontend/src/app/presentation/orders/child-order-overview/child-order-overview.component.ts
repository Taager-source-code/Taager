import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { ChildOrderItemDialogComponent } from '../child-order-item-dialog/child-order-item-dialog.component';
import { ORDER_STATUSES } from 'src/app/presentation/shared/constants';
import { Country } from 'src/app/presentation/shared/interfaces/countries';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';

@Component({
  selector: 'app-child-order-overview',
  templateUrl: './child-order-overview.component.html',
  styleUrls: ['./child-order-overview.component.scss']
})
export class ChildOrderOverviewComponent implements OnInit {
  @Input() childOrder: any;
  public statusStage = '';
  public isMobile: boolean ;
  public childOrderCountry: Country;
  public multitenancyFlag: boolean;

  constructor(
    private dialog: MatDialog,
    private responsiveService: ResponsiveService,
    private mixpanelService: MixpanelService,
    private multitenancyService: MultitenancyService
  ) {}

  ngOnInit(): void {
    this.getIsMobile();
    this.getChildOrderStatus(this.childOrder.status);
    this.multitenancyFlag = this.multitenancyService.isMultitenancyEnabled();
    this.childOrderCountry = this.multitenancyService.getCountryByIsoCode3(this.childOrder.countryIsoCode || 'EGY');
  }

  getChildOrderStatus(childOrderStatus: string): string {
    const statusObject = ORDER_STATUSES.ALL_STATUSES.filter(
      (status) => status.statusInEnglish === childOrderStatus);
    return statusObject.length === 0 ? childOrderStatus : statusObject[0].statusInArabic;
  };

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  convertDate(mongo) {
    if (mongo) {
      const date = new Date(mongo);
      return date.toLocaleDateString('en-US');
    } else {
return '';
}
  }

  getChildOrderType(childOrderId: string): string {
    return ORDER_STATUSES.CHILD_ORDER_TYPE_MAP.get(childOrderId.charAt(0)) || '';
  };

  onChildOrdersDetails(): void{
    const childOrders = [];
    childOrders.push(this.childOrder);
    const parentOrderData = {
      orderID : this.childOrder.pOrderId,
      receiverName : this.childOrder.receiverName,
      phoneNumber : this.childOrder.OrderPhoneNum
    };
    const dialogRef = this.dialog.open(ChildOrderItemDialogComponent, {
      width: '800px',
      data: {childOrders,
        order:parentOrderData,
        statusStage: this.statusStage},
    });

    dialogRef.afterClosed().subscribe((result) => {});

  }

  openChatModel(orderObj): void {
    /* eslint-disable */
    this.mixpanelService.track('Open_order_message', {
      'Order Id': orderObj.orderID, 
      Status: orderObj.status,
      'Shipping Company': orderObj.shippingInfo && orderObj.shippingInfo.company? orderObj.shippingInfo.company : 'No company',
    });
     /* eslint-enable */
  }

  matchDeliverySuspendedReason(reason) {
    return ORDER_STATUSES.DELIVERY_SUSPENSION_REASONS_TRANSLATION[reason] || '';
  };
}



