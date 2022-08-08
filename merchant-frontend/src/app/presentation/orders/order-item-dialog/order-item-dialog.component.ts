import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ORDER_STATUSES } from 'src/app/presentation/shared/constants';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { Country } from 'src/app/presentation/shared/interfaces/countries';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { OrderService } from 'src/app/presentation/shared/services/order.service';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { ShippingService } from 'src/app/presentation/shared/services/shipping.service';
import { ZendeskWidgetService } from '../../shared/services/zendesk.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

interface Products {
  productPrices: any;
  productQuantities: any;
  productIds: any;
  products: any;
}
@Component({
  selector: 'app-order-item-dialog',
  templateUrl: './order-item-dialog.component.html',
  styleUrls: ['./order-item-dialog.component.scss'],
})
export class OrderItemDialogComponent implements OnInit {
  public orderProductPrices;
  public orderProductQuantities;
  public products: any;
  public order = this.data.order;
  public isMobile: boolean;
  public transitEvents = [];
  public aramexTrackingResults = [];
  public vhubsTrackingResults = [];
  public waybillTrackingDetail = [];
  public viewProducts = this.data.viewProducts;
  public userType;
  public orderCountry: Country;
  public multitenancyFlag: boolean;

  constructor(
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private responsiveService: ResponsiveService,
    private shippingService: ShippingService,
    private orderService: OrderService,
    private multitenancyService: MultitenancyService,
    private zendeskService: ZendeskWidgetService,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.orderProductPrices = this.data.order.productPrices;
    this.orderProductQuantities = this.data.order.productQuantities;
    this.getProducts(this.data.order.products);
    if (!this.viewProducts) {
      if (this.data.TransitEvents) {
        this.transitEvents = this.data.TransitEvents;
      } else if (this.data.waybillTrackingDetail) {
        this.waybillTrackingDetail = this.data.waybillTrackingDetail;
      } else if (this.data.aramexTrackingResults) {
        this.aramexTrackingResults = this.data.aramexTrackingResults;
      } else if (this.data.vhubsTrackingResults) {
        this.vhubsTrackingResults = this.data.vhubsTrackingResults;
      } else {
        this.getOrderActivity();
      }
    }
    this.getIsMobile();
    this.getUserLevel();
    this.multitenancyFlag = this.multitenancyService.isMultitenancyEnabled();
    this.orderCountry = this.multitenancyService.getCountryByIsoCode3(this.order.country);
  }
  getUserLevel(): void {
    this.userType = 1;
  }
  getOrderActivity() {
    this.orderService
      .getOrderActivityWithStatus({
        orderID: this.order.orderID,
      })
      .subscribe((res) => {
        if (this.userType === 1) {
          this.transitEvents = res.data.map((x) => ({
            state: x.doc.orderStatus,
            timestamp: x.doc.createdAt,
            notes: x.doc.notes,
            suspendedReason: x.doc.suspendedReason
              ? this.mapNumbersToSuspendedReasons(x.doc.suspendedReason)
              : '',
            customerRejectedReason: x.doc.customerRejectedReason
              ? this.mapNumbersToCustomerRejectedReasons(
                x.doc.customerRejectedReason
              )
              : '',
            failedAttemptNote: x.doc.failedAttemptNote
              ? x.doc.failedAttemptNote +
              ' (attempt ' +
              x.doc.failedAttemptsCount +
              ') '
              : x.doc.deliverySuspendedReason
                ? x.doc.deliverySuspendedReason
                : '',
          }));
        } else {
          this.transitEvents = res.data.map((x) => ({
            state: x.orderStatus,
            timestamp: x.createdAt,
            notes: x.notes,
            suspendedReason: x.suspendedReason
              ? this.mapNumbersToSuspendedReasons(x.suspendedReason)
              : '',
            customerRejectedReason: x.customerRejectedReason
              ? this.mapNumbersToCustomerRejectedReasons(x.customerRejectedReason)
              : '',
            adminName: x.adminUserId ? x.adminUserId.fullName : '',
            failedAttemptNote: x.failedAttemptNote
              ? x.failedAttemptNote +
              ' (attempt ' +
              x.failedAttemptsCount +
              ') '
              : x.deliverySuspendedReason
                ? x.deliverySuspendedReason
                : '',
          }));
        }
      });
  }
  /* eslint-disable */
  mapNumbersToSuspendedReasons = (number) => ORDER_STATUSES.SUSPENSION_REASONS_MAP.get(number) || '';

  mapNumbersToCustomerRejectedReasons = (number) => ORDER_STATUSES.REJECTION_REASONS_MAP.get(number) || '';
  /* eslint-enable */
  downloadAWB() {
    if (this.order.shippingInfo.company === 'bosta') {
      const formData = {
        packageId: this.order.shippingInfo.packageId,
      };
      this.shippingService.getAWBFromBosta(formData).subscribe(
        (res) => {
          this.saveByteArray('awb', this.base64ToArrayBuffer(res.data.data));
        },
        (err) => {
          // console.log(err);
        }
      );
    } else if (this.order.shippingInfo.company === 'dreevo') {
      const link = document.createElement('a');
      link.href = this.order.shippingInfo.awb;
      link.download = 'awb';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  convertDate(mongo) {
    if (mongo) {
      const date = new Date(mongo);
      return date.toLocaleDateString('en-US');
    } else {
      return '';
    }
  }
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(reportName, byte) {
    const blob = new Blob([byte], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const fileName = reportName;
    link.download = fileName;
    link.click();
  }
  getProducts(orderprods) {
    this.productService
      .getProductsByIds(orderprods)
      .subscribe(async (res: any) => {
        this.products = res.data;
        this.products = this.products.map(product => {
          const productColorHex = product.attributes && product.attributes.filter(attribute => attribute.type === 'color')[0]?.value;
          return {
            ...product,
            productColorHex,
            productColor: productColorHex && COLOR_VARIANTS.filter(variant => variant.color === productColorHex)[0]?.arabicColorName,
            productSize: product.attributes && product.attributes.filter(attribute => attribute.type === 'size')[0]?.value,
          };
        });
      });
  }
  profitByProducts(
    profit: number,
    price: number,
    newPrice: number,
    quantity: number
  ): number {
    if (newPrice / quantity < price) {
      return profit;
    }
    return newPrice / quantity - price + profit;
  }
  openChatModel(orderObj): void {
    this.clipboard.copy(orderObj?.orderID);
    this.toastr.info('ØªÙ… Ù†Ø³Ø® Ø±Ù‚Ù… Ø§Ù„Ø§ÙˆØ±Ø¯Ø±');
    this.zendeskService.openChat();
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  returnOrderStatus(recievedStatus): string {
    const statusObject = ORDER_STATUSES.ALL_STATUSES.filter(
      (status) => status.statusInEnglish === recievedStatus);
    return statusObject.length === 0 ? recievedStatus : statusObject[0].statusInArabic;
  };

  epochToJsDate(ts: string): string {
    const epochDate = ts.replace('/Date(', '').replace(')/', '');
    const date = new Date(parseInt(epochDate)); //eslint-disable-line
    const jsDate = moment.utc(date).format();
    return jsDate;
  }
}


