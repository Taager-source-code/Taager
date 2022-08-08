import { Component, OnInit, Inject } from "@angular/core";
import { ProductService } from "../../../services/product.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { OrderChatComponent } from "../../../order/order-chat/order-chat.component";
import { ResponsiveService } from "../../../services/responsive.service";
import { ShippingService } from "../../../services/shipping.service";
import { OrderService } from "../../../services/order.service";
import { UserService } from "../../../services/user.service";
import * as moment from "moment";
import { UtilityService } from "../../../services/utility.service";
interface Products {
  productPrices: any;
  productQuantities: any;
  productIds: any;
  products: any;
}
@Component({
  selector: "app-order-item-dialog",
  templateUrl: "./order-item-dialog.component.html",
  styleUrls: ["./order-item-dialog.component.scss"],
})
export class OrderItemDialogComponent implements OnInit {
  public OrderProds;
  public OrderProductPrices;
  public OrderProductQuantities;
  public Products: any;
  public order = this.data.order;
  public isMobile: boolean;
  public TransitEvents = [];
  public aramexTrackingResults = [];
  public vhubsTrackingResults = [];
  public waybillTrackingDetail = [];
  public viewProducts = this.data.viewProducts;
  public userType;
  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private responsiveService: ResponsiveService,
    private shippingService: ShippingService,
    private orderService: OrderService,
    private userService: UserService,
    private utilityService: UtilityService
  ) {}
  ngOnInit(): void {
    this.OrderProds = this.data.order.products;
    this.OrderProductPrices = this.data.order.productPrices;
    this.OrderProductQuantities = this.data.order.productQuantities;
    this.getProducts();
    if (!this.viewProducts) {
      if (this.data.TransitEvents) this.TransitEvents = this.data.TransitEvents;
      else if (this.data.waybillTrackingDetail)
        this.waybillTrackingDetail = this.data.waybillTrackingDetail;
      else if (this.data.aramexTrackingResults)
        this.aramexTrackingResults = this.data.aramexTrackingResults;
      else if (this.data.vhubsTrackingResults)
        this.vhubsTrackingResults = this.data.vhubsTrackingResults;
      else this.getOrderActivity();
    }
    this.getIsMobile();
    this.getUserLevel();
  }
  getUserLevel(): void {
    this.userService.getUserLevel().subscribe((res) => {
      this.userType = res.data;
    });
  }
  getOrderActivity() {
    this.orderService
      .getOrderActivityWithStatus({
        orderID: this.order.orderID,
      })
      .subscribe((res) => {
        const mapNumbersToCustomerRejectedReasons = (number) => {
          let customerRejectedReason = "";
          switch (Number(number)) {
            case 1:
              customerRejectedReason = "اوردر مكرر";
              break;
            case 2:
              customerRejectedReason = "العميل بيقول مطلبتش حاجه";
              break;
            case 3:
              customerRejectedReason = "العميل يريد منتج مختلف";
              break;
            case 4:
              customerRejectedReason = "العميل مسافر";
              break;
            case 5:
              customerRejectedReason = "العميل يريد إضافة منتجات";
              break;
            case 6:
              customerRejectedReason = "لا يوجد توصيل لهذه المنطقة";
              break;
            case 7:
              customerRejectedReason = "اوردر خطأ، العميل يريد إستبدال المنتج";
              break;
            case 8:
              customerRejectedReason = "العميل استلم من مكان آخر";
              break;
            case 9:
              customerRejectedReason =
                "العميل اشترى من مكان آخر استلم من مكان آخر";
              break;
            case 10:
              customerRejectedReason = "العميل لا يحتاج المنتج";
              break;
            case 11:
              customerRejectedReason = "العميل رفض يقول أسباب الإلغاء";
              break;
            case 12:
              customerRejectedReason =
                "تأجيل لأكثر من أسبوع، برجاء الطلب مره اخرى اثناء احتياج العميل، قبلها بيومين";
              break;
            case 13:
              customerRejectedReason = "رفض باسباب شخصيه";
              break;
            case 14:
              customerRejectedReason = "الكميات كبيره";
              break;
            case 15:
              customerRejectedReason = "الرقم خطا";
              break;
            default:
              customerRejectedReason = "";
          }
          return customerRejectedReason;
        };
        if (this.userType == 1) {
          this.TransitEvents = res.data.map((x) => ({
            state: x.doc.orderStatus,
            timestamp: x.doc.createdAt,
            notes: x.doc.notes,
            suspendedReason: x.doc.suspendedReason
              ? this.utilityService.mapNumbersToSuspendedReasons(
                  x.doc.suspendedReason
                )
              : "",
            customerRejectedReason: x.doc.customerRejectedReason
              ? mapNumbersToCustomerRejectedReasons(
                  x.doc.customerRejectedReason
                )
              : "",
            failedAttemptNote: x.doc.failedAttemptNote
              ? x.doc.failedAttemptNote +
                " (attempt " +
                x.doc.failedAttemptsCount +
                ") "
              : x.doc.deliverySuspendedReason
              ? x.doc.deliverySuspendedReason
              : "",
          }));
        } else {
          this.TransitEvents = res.data.map((x) => ({
            state: x.orderStatus,
            timestamp: x.createdAt,
            notes: x.notes,
            suspendedReason: x.suspendedReason
              ? this.utilityService.mapNumbersToSuspendedReasons(
                  x.suspendedReason
                )
              : "",
            customerRejectedReason: x.customerRejectedReason
              ? mapNumbersToCustomerRejectedReasons(x.customerRejectedReason)
              : "",
            adminName: x.adminUserId ? x.adminUserId.fullName : "",
            failedAttemptNote: x.failedAttemptNote
              ? x.failedAttemptNote +
                " (attempt " +
                x.failedAttemptsCount +
                ") "
              : x.deliverySuspendedReason
              ? x.deliverySuspendedReason
              : "",
          }));
        }
      });
  }
  downloadAWB() {
    if (this.order.shippingInfo.company == "bosta") {
      const formData = {
        packageId: this.order.shippingInfo.packageId,
      };
      this.shippingService.getAWBFromBosta(formData).subscribe(
        (res) => {
          this.saveByteArray("awb", this.base64ToArrayBuffer(res.data.data));
        },
        (err) => {}
      );
    }
  }
  convertDate(mongo) {
    if (mongo) {
      var date = new Date(mongo);
      return date.toLocaleDateString("en-US");
    } else return "";
  }
  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }
  getProducts() {
    this.productService
      .getProductsByIds(this.OrderProds)
      .subscribe(async (res: any) => {
        this.Products = res.data;
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
    const dialogRefOrderChat = this.dialog.open(OrderChatComponent, {
      width: "850px",
      data: {
        order: orderObj,
        userId: orderObj.orderedBy,
      },
      disableClose: true,
    });
    dialogRefOrderChat.afterClosed().subscribe((result) => {});
  }
  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
  returnOrderStatus(status) {
    switch (status) {
      case "order_received":
        return "تم استلام الطلب";
        break;
      case "pending_shipping_company":
        return "في انتظار شركة الشحن";
        break;
      case "delivery_in_progress":
        return "التوصيل قيد التنفيذ";
        break;
      case "delivery_suspended":
        return "تم تعليق التوصيل";
        break;
      case "cancel":
        return "تم إلغاء الطلب";
        break;
      case "confirmed":
        return "تم تأكيد الطلب";
        break;
      case "taager_cancelled":
        return "التاجر ألغى الطلب";
        break;
      case "delivered":
        return "تم التوصيل";
        break;
      case "return_in_progress":
        return "الإسترجاع قيد التنفيذ";
        break;
      case "return_verified":
        return " تم الإسترجاع";
        break;
      case "replacement_in_progress":
        return "الاستبدال قيد التنفيذ";
        break;
      case "replacement_verified":
        return " تم الاستبدال";
        break;
      default:
        return status;
        break;
    }
  }
  epochToJsDate(ts: string): string {
    const epochDate = ts.replace("/Date(", "").replace(")/", "");
    let date = new Date(parseInt(epochDate));
    const jsDate = moment.utc(date).format();
    return jsDate;
  }
}
