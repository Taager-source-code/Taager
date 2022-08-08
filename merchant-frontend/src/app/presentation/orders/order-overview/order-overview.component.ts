import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderItemDialogComponent } from '../order-item-dialog/order-item-dialog.component';
import { RatingBarComponent } from '../rating-bar/rating-bar.component';
import { OrderRefundsComponent } from '../order-refunds/order-refunds.component';
import { OrderReplacementsComponent } from '../order-replacements/order-replacements.component';
import { OrderCompletionComponent } from '../order-completion/order-completion.component';
import { RefundsPolicyDialogComponent } from '../refunds-policy-dialog/refunds-policy-dialog.component';
import { ORDER_STATUSES } from 'src/app/presentation/shared/constants';
import { Country } from 'src/app/presentation/shared/interfaces/countries';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { OrderService } from 'src/app/presentation/shared/services/order.service';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { CancelOrderIssueDialogComponent } from '../cancel-order-issue-dialog/cancel-order-issue-dialog.component';
import { ChildOrderItemDialogComponent } from '../child-order-item-dialog/child-order-item-dialog.component';
import { TrackOrdersDialogComponent } from '../track-orders-dialog/track-orders-dialog.component';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { ShippingService } from 'src/app/presentation/shared/services/shipping.service';
import { ZendeskWidgetService } from '../../shared/services/zendesk.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

declare global {
  interface Window {
    order: any;
    sendMessageAboutAnOrder();
  }
}
@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss'],
})
export class OrderOverviewComponent implements OnInit {
  @Input() order: any;
  @Input() draft = false;
  @Output() cancelOrderDialogClosed: EventEmitter<void> = new EventEmitter();
  public currentRate = 0;
  public isMobile: boolean;
  public statusStage = '';
  public orderIssueMessage = '';
  public showAdditon = false;
  public childOrders: any;
  public shipmentCompaniesList;
  public shippmentTrackingExists = false;
  public orderCountry: Country;
  public multitenancyFlag: boolean;
  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private responsiveService: ResponsiveService,
    private mixpanelService: MixpanelService,
    private shippingService: ShippingService,
    private multitenancyService: MultitenancyService,
    private zendeskService: ZendeskWidgetService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getIsMobile();
    if (this.order.rating) {
      this.currentRate = this.order.rating;
    }
    this.returnOrderStatus(this.order.status);

    this.shipmentCompaniesList = {
      bosta: this.reloadBostaShipmentStatus,
      dreevo: this.reloadDreevoShipmentStatus,
      aramex: this.reloadAramexShipmentStatus,
      vhubs: this.reloadVHubsShipmentStatus
    };
    if (this.shipmentCompaniesList.hasOwnProperty(this.order.shippingInfo?.company)) {
      this.shippmentTrackingExists = true;
    }

    if (this.order.hasIssue === false) {
      this.orderService.getOrderIssue({ orderId: this.order._id }).subscribe( //eslint-disable-line
        (res) => {
          const declineReasons = res.data[0].declineReasons
            ? res.data[0].declineReasons
            : '';
          if (res.data[0].resolved === true) {
            this.order.resolved = true;
            switch (res.data[0].issueType) {
              case 1:
                this.orderIssueMessage = 'ØªÙ… Ù‚Ø¨ÙˆÙ„ Ø·Ù„Ø¨ Ø§Ø³ØªØ±Ø¬Ø§Ø¹ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ ';
                break;
              case 2:
                this.orderIssueMessage = 'ØªÙ… Ù‚Ø¨ÙˆÙ„ Ø·Ù„Ø¨ Ø§Ø³ØªØ¨Ø¯Ø§Ù„ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ ';
                break;
              case 3:
                this.orderIssueMessage = 'ØªÙ… Ù‚Ø¨ÙˆÙ„ Ø·Ù„Ø¨ Ø§Ø³ØªÙƒÙ…Ø§Ù„ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ ';
                break;
            }
          } else if (res.data[0].resolved === false) {
            this.order.resolved = false;
            switch (res.data[0].issueType) {
              case 1:
                this.orderIssueMessage =
                  'ØªÙ… Ø±ÙØ¶ Ø·Ù„Ø¨ Ø§Ø³ØªØ±Ø¬Ø§Ø¹ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ø¨Ø³Ø¨Ø¨ ' + declineReasons;
                break;
              case 2:
                this.orderIssueMessage =
                  'ØªÙ… Ø±ÙØ¶ Ø·Ù„Ø¨ Ø§Ø³ØªØ¨Ø¯Ø§Ù„ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ø¨Ø³Ø¨Ø¨ ' + declineReasons;
                break;
              case 3:
                this.orderIssueMessage =
                  'ØªÙ… Ø±ÙØ¶ Ø·Ù„Ø¨ Ø§Ø³ØªÙƒÙ…Ø§Ù„ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ø¨Ø³Ø¨Ø¨ ' + declineReasons;
                break;
            }
          }
        },
        () => { }
      );
      this.viewUserChildOrders();
    }
    this.showOrderAdditon();

    this.multitenancyFlag = this.multitenancyService.isMultitenancyEnabled();
    if (this.multitenancyFlag) {
      this.orderCountry = this.multitenancyService.getCountryByIsoCode3(this.order.country);
    }
  }

  openChatModel(orderObj): void {
    /* eslint-disable */
    this.mixpanelService.track('Open_order_message', {
      'Order Id': orderObj.orderID,
      Status: orderObj.status,
      'Shipping Company': orderObj.shippingInfo && orderObj.shippingInfo.company ? orderObj.shippingInfo.company : 'No company',
    });
    this.clipboard.copy(orderObj.orderID);
    /* eslint-enable */
    this.toastr.info('ØªÙ… Ù†Ø³Ø® Ø±Ù‚Ù… Ø§Ù„Ø§ÙˆØ±Ø¯Ø±');
    this.zendeskService.openChat();
  }
  openOrderRefunds(orderObj): void {
    const dialogRefOrderChat = this.dialog.open(OrderRefundsComponent, {
      width: '650px',
      data: {
        order: orderObj,
      },
      disableClose: true,
    });
    dialogRefOrderChat.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'confirmed') {
          this.order.hasIssue = true;
        }
      }
    });
  }
  openOrderReplacements(orderObj): void {
    const dialogRefOrderChat = this.dialog.open(OrderReplacementsComponent, {
      width: '650px',
      data: {
        order: orderObj,
      },
      disableClose: true,
    });
    dialogRefOrderChat.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'confirmed') {
          this.order.hasIssue = true;
        }
      }
    });
  }
  openOrderCompletion(orderObj): void {
    const dialogRefOrderChat = this.dialog.open(OrderCompletionComponent, {
      width: '650px',
      data: {
        order: orderObj,
      },
      disableClose: true,
    });
    dialogRefOrderChat.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'confirmed') {
          this.order.hasIssue = true;
        }
      }
    });
  }
  onTrackOrderActivity(order): void {
    /* eslint-disable */
    this.mixpanelService.track('Track_order', {
      'Order Id': order.orderID,
      Status: order.status,
      'Shipping Company': order.shippingInfo && order.shippingInfo.company ? order.shippingInfo.company : 'No company',
    });
    /* eslint-enable */
    const dialogRef = this.dialog.open(TrackOrdersDialogComponent, {
      width: '1200px',
      data: {
        order,
        viewProducts: false,
      },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  returnOrderStatus(recievedStatus): string {
    const statusObject = ORDER_STATUSES.ALL_STATUSES.filter(
      (status) => status.statusInEnglish === recievedStatus)[0];
    this.statusStage = statusObject ? statusObject.statusStage : 'received';
    return statusObject ? statusObject.statusInArabic : recievedStatus;
  };

  matchDeliverySuspendedReason(reason) {
    return ORDER_STATUSES.DELIVERY_SUSPENSION_REASONS_TRANSLATION[reason] || '';
  };

  mapNumbersToSuspendedReasons = (number) => ORDER_STATUSES.SUSPENSION_REASONS_MAP.get(number) || ''; //eslint-disable-line

  mapNumbersToCustomerRejectedReasons = (number) => ORDER_STATUSES.REJECTION_REASONS_MAP.get(number) || ''; //eslint-disable-line

  checkChildOrders(status): boolean {
    return ORDER_STATUSES.CHILD_ORDERS_STATUSES_ARRAY.includes(status);
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
  rateOrder() {
    const dialogRef = this.dialog.open(RatingBarComponent, {
      width: '500px',
      data: {
        currentRate: this.currentRate,
        order: this.order,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentRate = result.rating;
        this.order.complain = result.complain;
      }
      /*eslint-disable*/
      this.mixpanelService.track('Order_rating', {
        'Order Id': this.order.orderID,
        Status: this.order.status,
        Rating: this.currentRate,
        'Shipping Company': this.order.shippingInfo && this.order.shippingInfo.company ? this.order.shippingInfo.company : 'No company',

      });
      /*eslint-enable*/
    });
  }

  changeOrderStatus(order): void {
    const dialogRef = this.dialog.open(CancelOrderDialogComponent, {
      width: '550px',
      data: {
        order,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  cancelOrderIssue(order): void {
    this.orderService.getOrderIssue({ orderId: this.order._id }).subscribe( //eslint-disable-line
      (res) => {
        const totalOrderIssue = res.data.length;
        const lastCreatedIssue = res.data[totalOrderIssue - 1];
        if (lastCreatedIssue) {
          this.openCancelOrderIssueDialog(lastCreatedIssue);
        }
      },
      () => { }
    );
  }

  openCancelOrderIssueDialog(orderIssue) {
    const dialogRef = this.dialog.open(CancelOrderIssueDialogComponent, {
      width: '550px',
      data: {
        orderIssue
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.cancelOrderDialogClosed.emit();
      }
    });
  }

  onItemsDetails(order): void {
    /*eslint-disable*/
    this.mixpanelService.track('Order_details', {
      'Order Id': order.orderID,
      Status: order.status,
      'Shipping Company': order.shippingInfo && order.shippingInfo.company ? order.shippingInfo.company : 'No company',
    });
    /*eslint-enable*/

    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '800px',
      data: {
        order,
        viewProducts: true,
        draft: this.draft,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  onChildOrdersDetails(): void {
    const dialogRef = this.dialog.open(ChildOrderItemDialogComponent, {
      width: '800px',
      data: {
        childOrders: this.childOrders,
        order: this.order,
        statusStage: this.statusStage,
        displayIDsInTable: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });

  }

  onTrackOrder(res): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '800px',
      data: {
        order: this.order,
        TransitEvents: res.data.TransitEvents, //eslint-disable-line
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openRefundPolicy() {
    const dialogRef = this.dialog.open(RefundsPolicyDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  showOrderAdditon() {
    if (
      !this.order.isOrderVerified &&
      (this.order.products.length > 1 || this.order.productQuantities[0] > 1)
    ) {
      this.showAdditon = true;
    }
  }

  reloadShipmentStatus() {
    if (this.shipmentCompaniesList[this.order.shippingInfo.company]) {
      this.shipmentCompaniesList[this.order.shippingInfo.company].call(this);
    }
  }

  reloadAramexShipmentStatus() {
    if (this.order.shippingInfo.company === 'aramex') {
      const formData = {
        trackingNumber: this.order.shippingInfo.trackingNumber,
      };
      this.shippingService
        .trackShipmentFromAramex(formData)
        .subscribe((res) => {
          this.onTrackAramexOrder(res.trackingResults);
        });
    }
  }

  reloadVHubsShipmentStatus() {
    if (this.order.shippingInfo.company === 'vhubs') {
      const formData = {
        trackingNumber: this.order.shippingInfo.trackingNumber,
        orderID: this.order.orderID
      };
      this.shippingService
        .trackShipmentFromVHubs(formData)
        .subscribe((res) => {
          this.onTrackVHubsOrder(res.data);
        });
    }
  }

  reloadBostaShipmentStatus() {
    if (this.order.shippingInfo.company === 'bosta') {
      const formData = {
        trackingNumber: this.order.shippingInfo.trackingNumber,
      };
      this.shippingService.trackPackageFromBosta(formData).subscribe((res) => {
        this.onTrackBostaOrder(res);
      });
    }
  }

  reloadDreevoShipmentStatus() {
    const formData = {
      WaybillNumbers: this.order.shippingInfo.trackingNumber, //eslint-disable-line
    };
    this.shippingService.trackPackageFromDreevo(formData).subscribe((res) => {
      this.onTrackDreevoOrder(
        res.data.waybillTrackDetailList[0].waybillTrackingDetail
      );
    });
  }

  onTrackDreevoOrder(waybillTrackingDetail): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '800px',
      data: {
        order: this.order,
        waybillTrackingDetail,
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  onTrackBostaOrder(res): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '800px',
      data: {
        order: this.order,
        TransitEvents: res.data.TransitEvents, //eslint-disable-line
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  viewUserChildOrders(): void {
    const filter = {
      status: '',
      orderID: '',
      parentOrderId: this.order.orderID,
      taagerID: '',
      fromDate: '',
      toDate: ''
    };
    this.orderService.getChildOrders({ pageSize: 100, pageNum: 1, filter })
      .subscribe(
        (res: any) => {
          this.childOrders = res.data.reverse();
        },
        () => { }
      );
  }

  onTrackAramexOrder(aramexTrackingResults): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '800px',
      data: {
        order: this.order,
        aramexTrackingResults,
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  onTrackVHubsOrder(vhubsTrackingResults): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '800px',
      data: {
        order: this.order,
        vhubsTrackingResults,
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
}


