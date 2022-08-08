import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { ShippingService } from "../../services/shipping.service";
import { FormGroup, FormBuilder, FormArray, FormControl } from "@angular/forms";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { AddDeliveryPackageComponent } from "../add-delivery-package/add-delivery-package.component";
import { MatDialog } from "@angular/material/dialog";
import { OrderItemDialogComponent } from "../../account/orders/order-item-dialog/order-item-dialog.component";
import { COLOR_VARIANTS } from "../../../shared/constants/variants";
import { finalize } from "rxjs/operators";
interface OrderStatusReq {
  status: string;
  streetName: string;
  detailedAddress: Object;
  notes: string;
  deliveryNotes: string;
  trackingId: string;
  orders: [];
  deliveryDate: string;
  replacementDate: string;
  pickupDate: string;
  deliverySuspendedReason: string;
  province: string;
  receiverName: string;
  phoneNumber: string;
  phoneNumber2: string;
  shippingNotes: string;
  cashOnDelivery: number;
  productQuantities: any[];
  productPrices: any[];
  profit: number;
  productReturnQuantities: any[];
  productReplacedQuantities: any[];
  shippingInfo: object;
  confirmedVia: string;
  suspendedReason: string;
  delayedReason: string;
  customerRejectedReason: string;
  zone: Object;
  preferredDeliveryDate?: string;
}

interface ReloadOrderStatusReq {
  status: string;
  order: [];
  orders: any;
  deliverySuspendedReason: string;
}
@Component({
  selector: "app-change-order-status-dialog",
  templateUrl: "./change-order-status-dialog.component.html",
  styleUrls: ["./change-order-status-dialog.component.scss"],
})
export class ChangeOrderStatusDialogComponent implements OnInit {
  @ViewChild(AddDeliveryPackageComponent) deliveryComp;
  public currentStatus = "pending_shipping_company";
  public changeOrderStatusForm: FormGroup;
  public reqObj = {} as OrderStatusReq;
  public reloadReqObj = {} as ReloadOrderStatusReq;
  public productList: FormArray;
  public productReturnReplaceQuantities: FormArray;
  public whatsappTemplateMessage: string = "";
  public phoneNumber: string;
  public phoneNumber2: string;
  public failedAttemptsCounter: number;
  public orderID: string;
  public fbPageName: string = "";
  public fbPageUrl: string = "";
  confirmedVia: string;
  suspendedReason: string;
  delayedReason: string;
  customerRejectedReason: string;
  provinces: any[] = [];
  originalZones: any[] = [];
  zones: any[] = [];
  showQtyEdit = false;
  currentProvinceShipping = 0;
  currentCOD = 0;
  currentProductQuantities: any[] = [];
  currentProductPrices: any[] = [];
  productQuantities: any[] = [];
  productPrices: any[] = [];
  products: any[] = [];
  productReturnQuantities: any[] = [];
  productReplacedQuantities: any[] = [];
  selectedProvince;
  profit = 0;
  qtyValid = true;
  provinceValid = true;
  clicked = false;
  calculatedProfit = false;
  public zonesFilterCtrl: FormControl = new FormControl();
  public filteredZones = [];
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private shippingService: ShippingService,
    private productService: ProductService,
    private dilogRef: MatDialogRef<ChangeOrderStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private clipboard: Clipboard
  ) {
    this.changeOrderStatusForm = new FormGroup({
      status: new FormControl(),
      streetName: new FormControl(),
      building: new FormControl(),
      floor: new FormControl(),
      apartment: new FormControl(),
      landmark: new FormControl(),
      notes: new FormControl(),
      trackingId: new FormControl(),
      shippingCompanyName: new FormControl(),
      packageId: new FormControl(),
      deliveryNotes: new FormControl(),
      deliveryDate: new FormControl(),
      preferredDeliveryDate: new FormControl(),
      replacementDate: new FormControl(),
      pickupDate: new FormControl(),
      deliverySuspendedReason: new FormControl(),
      otherReasonText: new FormControl(),
      province: new FormControl(),
      orderID: new FormControl({ value: "", disabled: true }),
      fbPageName: new FormControl({ value: "", disabled: true }),
      fbPageUrl: new FormControl({ value: "", disabled: true }),
      createdAt: new FormControl({ value: "", disabled: true }),
      receiverName: new FormControl(),
      phoneNumber: new FormControl(),
      phoneNumber2: new FormControl(),
      whatsappTemplateMessage: new FormControl(),
      cashOnDelivery: new FormControl({ value: 0, disabled: true }),
      profit: new FormControl({ value: 0, disabled: true }),
      productList: this.formBuilder.array([]),
      productReturnReplaceQuantities: this.formBuilder.array([]),
      shippingCompany: new FormControl({ value: "", disabled: false }),
      failedAttemptsCount: new FormControl({ value: 0, disabled: true }),
      failedAttemptNote: new FormControl({ value: "", disabled: false }),
      shippingNotes: new FormControl({ value: "" }),
      confirmedVia: new FormControl(),
      suspendedReason: new FormControl(),
      delayedReason: new FormControl(),
      customerRejectedReason: new FormControl(),
      zone: new FormControl(),
    });

    if (this.data) {
      this.currentStatus = this.data.orderStatus;

      if (!this.data.batchUpdate) {
        //&& (this.currentStatus=='order_received' || this.currentStatus=='return_in_progress' || this.currentStatus=='replace_in_progress'))
        this.orderService
          .getProvinces(this.data.country)
          .subscribe((res: any) => {
            this.provinces = res.data;
            this.currentProvinceShipping = res.data.find(
              (x) => x.isActive && x.location == this.data.province
            )?.shippingRevenue;
            res.data.map((x) => {
              if (x.location == this.data.province) {
                this.selectedProvince = x;
                this.originalZones = x.redZones.concat(x.greenZones);
                this.zones = this.originalZones;
              }
            });
          });
        this.changeOrderStatusForm.patchValue({
          notes: this.data.notes,
          streetName: this.data.streetName,
          building: this.data.detailedAddress?.building || "",
          floor: this.data.detailedAddress?.floor || "",
          apartment: this.data.detailedAddress?.apartment || "",
          landmark: this.data.detailedAddress?.landmark || "",
          province: this.data.province,
          zone: this.data.zone?.name,
          orderID: this.data.orderID,
          fbPageName: this.data?.orderSource?.pageName,
          fbPageUrl: this.data?.orderSource?.pageUrl,
          createdAt: this.data.createdAt,
          receiverName: this.data.receiverName,
          phoneNumber: this.data?.phoneNumber?.toString().trim(),
          phoneNumber2: this.data?.phoneNumber2?.toString().trim(),
          cashOnDelivery: this.data.cashOnDelivery, //&& this.data.cashOnDelivery!=0? this.data.cashOnDelivery : this.calculateInitialCOD(),
          profit: this.data.profit,
          failedAttemptsCount: this.data.failedAttemptsCount
            ? this.data.failedAttemptsCount
            : 0,
          shippingCompanyName:
            this.data.shippingInfo && this.data.shippingInfo.company
              ? this.data.shippingInfo.company
              : null,
          packageId:
            this.data.shippingInfo && this.data.shippingInfo.packageId
              ? this.data.shippingInfo.packageId
              : null,
          trackingId:
            this.data.shippingInfo && this.data.shippingInfo.trackingNumber
              ? this.data.shippingInfo.trackingNumber
              : null,
          shippingNotes: this.data.shippingNotes ? this.data.shippingNotes : "",
        });

        this.phoneNumber = this.data.phoneNumber?.toString().trim();
        this.phoneNumber2 = this.data.phoneNumber2?.toString().trim();
        this.failedAttemptsCounter = this.data.failedAttemptsCount
          ? this.data.failedAttemptsCount
          : 0;
        this.orderID = this.data.orderID;
        this.fbPageName = this.data?.orderSource?.fbPageName;
        this.fbPageUrl = this.data?.orderSource?.fbPageUrl;
        this.productQuantities = [...this.data.productQuantities];
        this.productPrices = [...this.data.productPrices];
        this.profit = this.data.profit;
        this.currentProductQuantities = [...this.data.productQuantities];
        this.currentProductPrices = [...this.data.productPrices];
        this.currentCOD = this.data.cashOnDelivery; //&& this.data.cashOnDelivery!=0? this.data.cashOnDelivery : this.calculateInitialCOD();
        this.productReturnQuantities =
          this.data.productReturnQuantities &&
          this.data.productReturnQuantities.length > 0
            ? [...this.data.productReturnQuantities]
            : this.currentStatus == "delivered"
            ? [...this.data.productQuantities]
            : null;
        this.productReplacedQuantities =
          this.data.productReplacedQuantities &&
          this.data.productReplacedQuantities.length > 0
            ? [...this.data.productReplacedQuantities]
            : this.currentStatus == "return_verified"
            ? [...this.data.productReturnQuantities]
            : null;

        this.productService.getProductsByIds(this.data.products).subscribe(
          (res: any) => {
            this.products = res.data;

            let productNames = "";
            this.products.forEach((item, index) => {
              let productColorName;
              let productSize;
              if (item.attributes && item.attributes.length > 0) {
                const colorObject = item.attributes.filter(
                  (attribute) => attribute.type === "color"
                )[0];
                const filteredColor = COLOR_VARIANTS.filter(
                  (color) => colorObject && colorObject.value === color.color
                )[0];
                productColorName = filteredColor
                  ? filteredColor.arabicColorName
                  : "";
                productSize = item.attributes.filter(
                  (attribute) => attribute.type === "size"
                )[0]?.value;
              }
              productNames += `${item.productName}${
                productColorName ? "- " + productColorName : ""
              }${productSize ? "- " + productSize : ""} - ${
                this.data.productQuantities[index]
              }\n`;
            });
            this.whatsappTemplateMessage =
              `Ø¹Ø²ÙŠØ²ÙŠ Ø§Ù„Ø¹Ù…ÙŠÙ„ ${this.data.receiverName} Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø¹Ù„Ù… Ø£Ù†Ù‡ Ù‚Ø¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹ÙƒÙ… Ù„ØªØ§ÙƒÙŠØ¯ Ø§Ù„Ø§ÙˆØ±Ø¯Ø± Ø§Ù„Ø®Ø§Øµ Ø¨ÙƒÙ…` +
              `

              ${productNames} ` +
              `

              :Ø§Ù„Ø³Ø¹Ø±
              ${this.data.cashOnDelivery}
              Ø¬Ù†ÙŠÙ‡ Ù…ØµØ±Ù‰ Ø´Ø§Ù…Ù„ Ø§Ù„ØªÙˆØµÙŠÙ„ ` +
              `

              :ÙƒÙˆØ¯ Ø§Ù„Ø§ÙˆØ±Ø¯Ø±
              ${this.orderID} ` +
              `

              Ù„Ù„ØªØ£ÙƒÙŠØ¯ ÙŠØ±Ø¬ÙŠ Ø§Ø±Ø³Ø§Ù„ Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ØªÙØµÙŠÙ„ÙŠ .. Ø³ÙŠØªÙ… Ø§Ù„Ø§Ø±Ø³Ø§Ù„ Ø®Ù„Ø§Ù„ ÙŠÙˆÙ…ÙŠÙ† Ù„Ù„Ù‚Ø§Ù‡Ø±Ø© ÙˆØ§Ù„Ø¬ÙŠØ²Ø© Ùˆ Ø®Ù„Ø§Ù„ Ù¤Ù„Ù¦ Ø§ÙŠØ§Ù… Ù„Ù„Ù…Ø­Ø§ÙØ¸Ø§Øª Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ Ù…Ù† Ø§Ù„Ø³Ø¨Øª Ù„Ù„Ø®Ù…ÙŠØ³ Ù…Ù† Ù¡Ù  ØµØ¨Ø§Ø­Ø§Ù‹ Ø§Ù„ÙŠ Ù¦ Ù…Ø³Ø§Ø¡ .. ÙˆÙ„Ø£ÙŠ Ø¥Ø³ØªÙØ³Ø§Ø± Ø¹Ù† Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø±Ø¬ÙˆØ¹ Ù„Ù„ØµÙØ­Ø©.

              ` +
              `
              ÙˆÙ„Ø£ÙŠ Ø¥Ø³ØªÙØ³Ø§Ø± Ø¹Ù† Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø±Ø¬ÙˆØ¹ Ù„Ù„ØµÙØ­Ø©
              ${
                this.data?.orderSource?.pageUrl
                  ? this.data?.orderSource?.pageUrl
                  : ""
              } ${
                this.data?.orderSource?.pageName
                  ? this.data?.orderSource?.pageName
                  : ""
              }
              ` +
              `Ù†Ø­Ù† Ù‚Ø³Ù… Ø§Ù„ØªØ£ÙƒÙŠØ¯ ÙÙ‚Ø· .. Ùˆ ÙŠØ±Ø¬Ù‰ Ø§Ø±Ø³Ø§Ù„ Ø±Ù‚Ù… Ø§Ø®Ø± Ù„ØªØ³Ù‡ÙŠÙ„ ÙˆØµÙˆÙ„ Ø§Ù„Ø§ÙˆØ±Ø¯Ø±.`;

            if (
              this.currentStatus == "order_received" ||
              this.currentStatus == "suspended"
            )
              this.setProductsConfirmQty(this.products);
            else if (this.currentStatus == "delivered")
              this.setProductsReturnQty(this.products);
            else if (this.currentStatus == "return_verified")
              this.setProductsReplaceQty(this.products);
          },
          (err) => {}
        );
      }
    }
  }

  copyWhatsAppNumber1() {
    this.clipboard.copy(this.whatsappTemplateMessage);
    let phoneNumber = `${this.changeOrderStatusForm.value.phoneNumber}`;
    if (this.data.country === "EGY") {
      phoneNumber = `+2${phoneNumber}`;
    } else if (this.data.country === "SAU") {
      if (phoneNumber.startsWith("966")) {
        phoneNumber = `+${phoneNumber}`;
      } else if (this.phoneNumber.startsWith("0")) {
        phoneNumber = `+966${phoneNumber.substring(1)}`;
      } else if (!phoneNumber.startsWith("+966")) {
        phoneNumber = `+966${phoneNumber}`;
      }
    }
    window.open(`http://wa.me/${phoneNumber}`, "_blank");
  }

  copyWhatsAppNumber2() {
    this.clipboard.copy(this.whatsappTemplateMessage);
    let phoneNumber2 = `${this.changeOrderStatusForm.value.phoneNumber2}`;
    if (this.data.country === "EGY") {
      phoneNumber2 = `+2${phoneNumber2}`;
    } else if (this.data.country === "SAU") {
      if (phoneNumber2.startsWith("966")) {
        phoneNumber2 = `+${phoneNumber2}`;
      } else if (this.phoneNumber.startsWith("0")) {
        phoneNumber2 = `+966${phoneNumber2.substring(1)}`;
      } else if (!phoneNumber2.startsWith("+966")) {
        phoneNumber2 = `+966${phoneNumber2}`;
      }
    }
    window.open(`http://wa.me/${phoneNumber2}`, "_blank");
  }
  reloadShipmentStatus() {
    if (this.data.shippingInfo.company === "bosta")
      this.reloadBostaShipmentStatus();
    else if (this.data.shippingInfo.company === "aramex")
      this.reloadAramexShipmentStatus();
  }
  reloadBostaShipmentStatus() {
    if (this.data.shippingInfo.company === "bosta") {
      const formData = {
        trackingNumber: this.data.shippingInfo.trackingNumber,
      };
      this.shippingService.trackPackageFromBosta(formData).subscribe((res) => {
        this.reloadOrderStatusFromBosta(res);
      });
    }
  }
  reloadAramexShipmentStatus() {
    if (this.data.shippingInfo.company === "aramex") {
      const formData = {
        trackingNumber: this.data.shippingInfo.trackingNumber,
      };
      this.shippingService
        .trackShipmentFromAramex(formData)
        .subscribe((res) => {
          this.reloadOrderStatusFromAramex(res, this.data);
        });
    }
  }

  reloadVHubsShipmentStatus() {
    if (this.data.shippingInfo.company === "vhubs") {
      const formData = {
        trackingNumber: this.data.shippingInfo.trackingNumber,
        orderID: this.data.orderID,
      };
      this.shippingService.trackShipmentFromVHubs(formData).subscribe((res) => {
        this.onTrackVHubsOrder(res.data);
      });
    }
  }

  reloadOrderStatusFromAramex = (res, data) => {
    this.onTrackAramexOrder(res.trackingResults);
    var status = "";
    var reason = "";
    var deliverySuspendedReason = "";
    var pickupDate = null;
    var deliveryDate = null;
    if (
      data.status === "pending_shipping_company" ||
      data.status === "delivery_in_progress" ||
      data.status === "delivery_suspended" ||
      data.status == "return_in_progress"
    ) {
      if (
        res.trackingResults[0].UpdateCode === "SH308" ||
        res.trackingResults[0].UpdateCode === "SH312"
      ) {
        status = "pending_shipping_company";
      } else if (
        res.trackingResults[0].UpdateCode === "SH515" ||
        res.trackingResults[0].UpdateCode === "SH314" ||
        res.trackingResults[0].UpdateCode === "SH014" ||
        res.trackingResults[0].UpdateCode === "SH273" ||
        res.trackingResults[0].UpdateCode === "SH513" ||
        res.trackingResults[0].UpdateCode === "SH272" ||
        res.trackingResults[0].UpdateCode === "SH110" ||
        res.trackingResults[0].UpdateCode === "SH003" ||
        res.trackingResults[0].UpdateCode === "SH047" ||
        res.trackingResults[0].UpdateCode === "SH012" ||
        res.trackingResults[0].UpdateCode === "SH160"
      ) {
        status = "delivery_in_progress";
      } else if (res.trackingResults[0].UpdateCode === "SH005") {
        status = "delivered";
        deliveryDate = res.trackingResults[0].UpdateDateTime;
      } else if (
        res.trackingResults[0].UpdateCode === "SH578" ||
        res.trackingResults[0].UpdateCode === "SH157" ||
        res.trackingResults[0].UpdateCode === "SH162" ||
        res.trackingResults[0].UpdateCode === "SH044" ||
        res.trackingResults[0].UpdateCode === "SH008" ||
        res.trackingResults[0].UpdateCode === "SH376" ||
        res.trackingResults[0].UpdateCode === "SH410" ||
        res.trackingResults[0].UpdateCode === "SH275" ||
        res.trackingResults[0].UpdateCode === "SH033" ||
        res.trackingResults[0].UpdateCode === "SH043" ||
        res.trackingResults[0].UpdateCode === "SH294"
      ) {
        status = "delivery_suspended";
        reason = res.trackingResults[0].Comments;
        deliverySuspendedReason = res.trackingResults[0].Comments;
      } else if (res.trackingResults[0].UpdateCode == "SH498") {
        status = "return_in_progress";
        reason = res.trackingResults[0].Comments;
        deliverySuspendedReason = res.trackingResults[0].Comments;
      } else if (res.trackingResults[0].UpdateCode == "SH069") {
        status = "return_verified";
        reason = res.trackingResults[0].Comments;
        deliverySuspendedReason = res.trackingResults[0].Comments;
      }
      if (data.status != status && status != "delivered") {
        var selectedOrders = [
          {
            _id: this.data._id,
            orderID: this.data.orderID,
            status: this.data.orderStatus,
            orderProfit: this.data.orderProfit,
            orderedBy: this.data.orderedBy,
            isOrderVerified: this.data.isOrderVerified,
          },
        ];
        this.reloadReqObj.status = status;
        this.reloadReqObj.orders = selectedOrders;
        this.reloadReqObj.deliverySuspendedReason = reason;
        this.orderService.updateOrderStatusCustom(this.reloadReqObj).subscribe(
          (res: any) => {
            this.toastr.success(res.msg);
          },
          (err) => {}
        );
      }
    }
  };

  onTrackAramexOrder(aramexTrackingResults): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: "800px",
      data: {
        order: this.data,
        aramexTrackingResults: aramexTrackingResults,
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onTrackVHubsOrder(vhubsTrackingResults): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: "800px",
      data: {
        order: this.data,
        vhubsTrackingResults: vhubsTrackingResults,
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onTrackBostaOrder(TransitEvents): void {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: "800px",
      data: {
        order: this.data,
        TransitEvents: TransitEvents,
        viewProducts: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  reloadOrderStatusFromBosta(res) {
    this.onTrackBostaOrder(res.data.TransitEvents);
    var status = "";
    var reason = "";
    var revert = true;
    if (
      res.data.CurrentStatus.state === "AVAILABLE_FOR_PICKUP" ||
      res.data.CurrentStatus.state === "TICKET_CREATED"
    ) {
      status = "pending_shipping_company";
    } else if (
      res.data.CurrentStatus.state === "PACKAGE_RECEIVED" ||
      res.data.CurrentStatus.state === "NOT_YET_SHIPPED" ||
      res.data.CurrentStatus.state === "IN_TRANSIT" ||
      res.data.CurrentStatus.state === "OUT_FOR_DELIVERY"
    ) {
      status = "delivery_in_progress";
      if (this.data.orderStatus == "pending_shipping_company") revert = false;
    } else if (
      res.data.CurrentStatus.state === "RECEIVED_DELIVERY_LOCATION" ||
      res.data.CurrentStatus.state === "DELIVERED"
    ) {
      status = "delivered";
      if (
        this.data.orderStatus == "delivery_in_progress" ||
        this.data.orderStatus == "delivery_suspended"
      )
        revert = false;
    } else if (
      res.data.CurrentStatus.state === "CANCELLED" ||
      res.data.CurrentStatus.state === "WAITING_FOR_CUSTOMER_ACTION" ||
      res.data.CurrentStatus.state === "DELAYED"
    ) {
      status = "delivery_suspended";
      reason = res.data.TransitEvents.reason;
      if (this.data.orderStatus == "pending_shipping_company") revert = false;
    } else if (
      res.data.CurrentStatus.state === "DELIVERED_TO_SENDER" ||
      res.data.CurrentStatus.state === "DELIVERY_FAILED"
    ) {
      status = "cancel";
      reason = res.data.TransitEvents.reason;
      revert = false;
    }
    if (this.data.orderStatus != status && status != "delivered") {
      if (revert) {
        this.reloadReqObj.status = status;
        this.reloadReqObj.order = this.data;
        if (reason) this.reloadReqObj.deliverySuspendedReason = reason;
        this.orderService.revertOrderStatus(this.reloadReqObj).subscribe(
          (res: any) => {
            this.toastr.success(res.msg);
          },
          (err) => {}
        );
      } else {
        var selectedOrders = [
          {
            _id: this.data._id,
            orderID: this.data.orderID,
            status: this.data.orderStatus,
            orderProfit: this.data.orderProfit,
            orderedBy: this.data.orderedBy,
            isOrderVerified: this.data.isOrderVerified,
          },
        ];
        this.reloadReqObj.status = status;
        this.reloadReqObj.orders = selectedOrders;
        this.reloadReqObj.deliverySuspendedReason = reason;
        this.orderService.updateOrderStatusCustom(this.reloadReqObj).subscribe(
          (res: any) => {
            this.toastr.success(res.msg);
          },
          (err) => {}
        );
      }
    }
  }

  ngOnInit() {
    if (this.currentStatus === "order_received") {
      this.changeOrderStatusForm.patchValue({ status: "confirmed" });
    }
    this.zonesFilterCtrl.valueChanges.subscribe(([prev, next]: [any, any]) => {
      this.filterItem();
    });
  }

  submit() {
    var shippingCompanies = ["bosta", "aramex", "vhubs"];
    if (
      this.changeOrderStatusForm.value.status === "pending_shipping_company" &&
      shippingCompanies.includes(
        this.changeOrderStatusForm.value.shippingCompany
      )
    ) {
      this.deliveryComp.CreateDelivery();
    } else this.updateStatus();
  }

  public isSubmitEnabled() {
    return this.changeOrderStatusForm.invalid;
  }

  updateStatus(shippingInfo?: Object) {
    this.clicked = true;
    if (!this.data.batchUpdate) {
      this.prepareOrderDataForReturnReplace(
        this.changeOrderStatusForm.value.status
      );
    }
    if (
      !this.changeOrderStatusForm.value.zone &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…Ù†Ø·Ù‚Ø©");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.deliveryDate &&
      this.changeOrderStatusForm.value.status == "delivered"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© Ù…ÙŠØ¹Ø§Ø¯ Ø§Ù„ØªÙˆØµÙŠÙ„");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.shippingCompany &&
      this.changeOrderStatusForm.value.status === "pending_shipping_company"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ø§Ø®ØªÙŠØ§Ø± Ø´Ø±ÙƒØ© Ø§Ù„Ø´Ø­Ù† Ø§Ùˆ Ø§Ø¯Ø®Ø§Ù„ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø¨Ù†ÙØ³Ùƒ");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.trackingId &&
      this.changeOrderStatusForm.value.status == "pending_shipping_company" &&
      this.changeOrderStatusForm.value.shippingCompany == "other"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© Ø§Ù„ Tracking Id");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.shippingCompanyName &&
      this.changeOrderStatusForm.value.status == "pending_shipping_company" &&
      this.changeOrderStatusForm.value.shippingCompany == "other"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© Ø§Ø³Ù… Ø´Ø±ÙƒØ© Ø§Ù„Ø´Ø­Ù†");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.streetName &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© streetName");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.building &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© building");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.floor &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© floor");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.apartment &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© apartment");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.pickupDate &&
      this.changeOrderStatusForm.value.status == "delivery_in_progress"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© Ù…ÙŠØ¹Ø§Ø¯ Ø§Ù„ pickUp");
      this.clicked = false;
      return 0;
    }
    if (
      !this.changeOrderStatusForm.value.confirmedVia &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© Ø§Ø®ØªÙŠØ§Ø± Ø·Ø±ÙŠÙ‚Ø© ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨");
      this.clicked = false;
      return 0;
    }
    if (
      !/^[0-9]+$/.test(this.changeOrderStatusForm.value.phoneNumber) &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ø§Ù† ØªØ­ØªÙˆÙŠ Ø®Ø§Ù†Ø© phoneNumber Ø¹Ù„ÙŠ Ø£Ø±Ù‚Ø§Ù… ÙÙ‚Ø·");
      this.clicked = false;
      return 0;
    }
    if (
      !/^[0-9]+$/.test(this.changeOrderStatusForm.value.phoneNumber2) &&
      this.changeOrderStatusForm.value.status == "confirmed"
    ) {
      this.toastr.error("ÙŠØ¬Ø¨ Ø§Ù† ØªØ­ØªÙˆÙŠ Ø®Ø§Ù†Ø© phoneNumber2 Ø¹Ù„ÙŠ Ø£Ø±Ù‚Ø§Ù… ÙÙ‚Ø·");
      this.clicked = false;
      return 0;
    }
    if (this.qtyValid && this.provinceValid) {
      if (
        !this.productQuantities.every((x) => x == 0) ||
        this.productQuantities.length == 0
      ) {
        if (
          this.changeOrderStatusForm.valid &&
          this.changeOrderStatusForm.value
        ) {
          this.reqObj.notes = this.changeOrderStatusForm.value.notes;
          this.reqObj.status = this.changeOrderStatusForm.value.status
            ? this.changeOrderStatusForm.value.status
            : this.currentStatus;
          this.reqObj.orders = this.data.selectedOrders;
          this.reqObj.trackingId = this.changeOrderStatusForm.value.trackingId
            ? this.changeOrderStatusForm.value.trackingId
            : undefined;
          this.reqObj.streetName = this.changeOrderStatusForm.value.streetName
            ? this.changeOrderStatusForm.value.streetName
            : undefined;
          this.reqObj.detailedAddress = {
            streetName: this.changeOrderStatusForm.value.streetName || "",
            building: this.changeOrderStatusForm.value.building || "",
            floor: this.changeOrderStatusForm.value.floor || "",
            apartment: this.changeOrderStatusForm.value.apartment || "",
            landmark: this.changeOrderStatusForm.value.landmark || "",
          };
          // tslint:disable-next-line:max-line-length
          this.reqObj.deliveryNotes = this.changeOrderStatusForm.value
            .deliveryNotes
            ? this.changeOrderStatusForm.value.deliveryNotes
            : undefined;
          // this.reqObj.isOrderVerified = (this.changeOrderStatusForm.value.isOrderVerified) ?
          //     this.changeOrderStatusForm.value.isOrderVerified : undefined;
          this.reqObj.deliveryDate = this.changeOrderStatusForm.value
            .deliveryDate
            ? moment(this.changeOrderStatusForm.value.deliveryDate)
                .startOf("day")
                .toISOString()
            : "";
          this.reqObj.preferredDeliveryDate = this.changeOrderStatusForm.value
            .preferredDeliveryDate
            ? moment(this.changeOrderStatusForm.value.preferredDeliveryDate)
                .startOf("day")
                .toISOString()
            : "";
          this.reqObj.replacementDate = this.changeOrderStatusForm.value
            .replacementDate
            ? moment(this.changeOrderStatusForm.value.replacementDate).format(
                "YYYY-MM-DD"
              )
            : "";
          this.reqObj.pickupDate = this.changeOrderStatusForm.value.pickupDate
            ? moment(this.changeOrderStatusForm.value.pickupDate).format(
                "YYYY-MM-DD"
              )
            : "";
          this.reqObj.deliverySuspendedReason = this.changeOrderStatusForm.value
            .deliverySuspendedReason
            ? this.changeOrderStatusForm.value.deliverySuspendedReason
            : undefined;
          if (this.reqObj.deliverySuspendedReason === "other")
            this.reqObj.deliverySuspendedReason = this.changeOrderStatusForm
              .value.otherReasonText
              ? this.changeOrderStatusForm.value.otherReasonText
              : "other";
          this.reqObj.province = this.changeOrderStatusForm.value.province
            ? this.changeOrderStatusForm.value.province
            : undefined;

          this.reqObj.receiverName = this.changeOrderStatusForm.value
            .receiverName
            ? this.changeOrderStatusForm.value.receiverName
            : undefined;
          this.reqObj.phoneNumber =
            this.changeOrderStatusForm.value.phoneNumber;
          this.reqObj.phoneNumber2 =
            this.changeOrderStatusForm.value.phoneNumber2;
          this.reqObj.cashOnDelivery = this.currentCOD
            ? this.currentCOD
            : undefined;
          this.reqObj.productQuantities =
            this.productQuantities && this.productQuantities.length > 0
              ? this.productQuantities
              : undefined;
          this.reqObj.productPrices =
            this.productPrices && this.productPrices.length > 0
              ? this.productPrices
              : undefined;
          this.reqObj.profit = this.profit
            ? this.profit
            : this.calculatedProfit
            ? 0
            : undefined;
          this.reqObj.productReturnQuantities =
            this.productReturnQuantities &&
            this.productReturnQuantities.length > 0
              ? this.productReturnQuantities
              : undefined;
          this.reqObj.productReplacedQuantities =
            this.productReplacedQuantities &&
            this.productReplacedQuantities.length > 0
              ? this.productReplacedQuantities
              : undefined;
          this.reqObj.shippingInfo = shippingInfo || {
            company: this.changeOrderStatusForm.value.shippingCompanyName || "",
            packageId: this.changeOrderStatusForm.value.packageId || "",
            trackingNumber: this.changeOrderStatusForm.value.trackingId || "",
          };
          this.reqObj.shippingNotes = this.changeOrderStatusForm.value
            .shippingNotes
            ? this.changeOrderStatusForm.value.shippingNotes
            : undefined;

          this.reqObj.confirmedVia =
            this.changeOrderStatusForm.value.confirmedVia;
          this.confirmedVia = this.changeOrderStatusForm.value.confirmedVia;
          this.reqObj.suspendedReason =
            this.changeOrderStatusForm.value.suspendedReason;
          this.suspendedReason =
            this.changeOrderStatusForm.value.suspendedReason;
          this.reqObj.delayedReason =
            this.changeOrderStatusForm.value.delayedReason;
          this.delayedReason = this.changeOrderStatusForm.value.delayedReason;
          this.reqObj.customerRejectedReason =
            this.changeOrderStatusForm.value.customerRejectedReason;
          this.customerRejectedReason =
            this.changeOrderStatusForm.value.customerRejectedReason;
          if (!this.selectedProvince) {
            this.toastr.error("No province added to the order");
            this.clicked = false;
            return;
          }
          this.reqObj.zone = {
            name:
              this.changeOrderStatusForm.value.zone ||
              (this.data.zone && this.data.zone.name) ||
              "",
            status: this.selectedProvince.redZones.includes(
              this.changeOrderStatusForm.value.zone
            )
              ? "red"
              : "green",
          };
          this.orderService
            .updateOrderStatusCustom(this.reqObj)
            .pipe(
              finalize(() => {
                this.clicked = false;
              })
            )
            .subscribe(
              (res: any) => {
                this.dilogRef.close();
                this.toastr.success(res.msg);
                if (
                  this.reqObj.status === "suspended" ||
                  this.reqObj.status === "customer_rejected" ||
                  this.reqObj.status === "delivery_suspended" ||
                  this.reqObj.status === "customer_refused"
                ) {
                  if (environment.ENABLE_MAIL_SEND)
                    this.orderService
                      .sendOrderChangeNotifications(this.reqObj)
                      .subscribe(
                        (res: any) => {
                          this.toastr.success(
                            "ØªÙ… Ø§Ø±Ø³Ø§Ù„Ø© Ø§Ø´Ø¹Ø§Ø± Ù„Ù„ØªØ§Ø¬Ø± Ø¨Ø­Ø§Ù„Ø© Ø§Ù„Ø·Ù„Ø¨"
                          );
                        },
                        (err) => {
                          this.toastr.error(
                            "Ø®Ø·Ø£ Ø­Ø¯Ø« Ø§Ø«Ù†Ø§Ø¡ Ø§Ø±Ø³Ø§Ù„ Ø§Ø´Ø¹Ø§Ø± Ù„Ù„ØªØ§Ø¬Ø± Ø¨Ø­Ø§Ù„Ø© Ø§Ù„Ø§ÙˆØ±Ø¯Ø±"
                          );
                        }
                      );
                }
              },
              (err) => {
                this.clicked = false;
                this.toastr.error(err.error.msg);
              }
            );
        }
      } else {
        this.clicked = false;
        this.toastr.error("At least one qty should be >0");
      }
    } else {
      this.clicked = false;
      this.toastr.error("Please enter province and all quantities");
    }
  }

  createProduct(name = "", qty = "") {
    return this.formBuilder.group({
      name,
      qty,
    });
  }

  onProvinceChange(e): void {
    let selectedOption = this.provinces.find(
      (x) => x.isActive && x.location == e.value
    );
    if (selectedOption) {
      this.selectedProvince = selectedOption;
      this.originalZones = this.selectedProvince.redZones.concat(
        this.selectedProvince.greenZones
      );
      this.zones = this.originalZones;
      this.provinceValid = true;
      const selectedPrice = selectedOption?.shippingRevenue;
      const COD =
        this.currentCOD - this.currentProvinceShipping + selectedPrice;
      this.changeOrderStatusForm.patchValue({
        cashOnDelivery: COD,
      });
      //buffer current info for shipping, COD to be used as previous in next change
      this.currentProvinceShipping = selectedPrice;
      this.currentCOD = COD;
      this.changeOrderStatusForm.get("zone").reset();
      if (!this.zones.includes(this.data.zone?.name)) {
        this.data.zone = null;
      }
    } else {
      this.provinceValid = false;
    }
  }

  onQtyChange(e): void {
    let index = e.target.getAttribute("data-index");

    //get new qty
    const newQty = e.target.value;

    if (newQty && newQty != "" && newQty >= 0) {
      this.qtyValid = true;

      //get previous total price (per product) and qty
      const totalPrice = this.currentProductPrices[index];
      const qty = this.currentProductQuantities[index];

      //get new total price (per product)
      let productPricePerItem;
      if (this.data.productQuantities[index]) {
        productPricePerItem =
          this.data.productPrices[index] / this.data.productQuantities[index];
      } else {
        const changedProduct = this.products.filter(
          (product) => product._id === this.data.products[index]
        )[0];
        const taagerProductProfit = changedProduct.productProfit;
        const taagerProductPrice = changedProduct.productPrice;
        const merchantsProductProfit = this.data.productProfits[index];
        productPricePerItem =
          taagerProductPrice + merchantsProductProfit - taagerProductProfit;
      }
      const newTotalPrice = productPricePerItem * newQty;

      //calculate product profit on order
      const productActualProfit = this.products[index].productProfit;
      const productActualPrice = this.products[index].productPrice;
      const productorderProfit =
        this.data.productProfits && this.data.productProfits.length > 0
          ? this.data.productProfits[index]
          : productPricePerItem - productActualPrice + productActualProfit;

      //calculate previous profit change
      const productOrderTotalProfit = productorderProfit * qty;
      //calculate new profit change
      const productOrderTotalNewProfit = productorderProfit * newQty;

      //calculate new profit, quantities, total prices (per product), COD
      this.profit =
        this.profit - productOrderTotalProfit + productOrderTotalNewProfit;
      this.productQuantities[index] = newQty;
      this.productPrices[index] = newTotalPrice;
      const COD = this.currentCOD - totalPrice + newTotalPrice;
      this.changeOrderStatusForm.patchValue({
        cashOnDelivery: COD,
        profit: this.profit,
      });
      this.data.selectedOrders[0].orderProfit = this.profit;
      //buffer current info for quantities, total prices (per product), COD to be used as previous in next change
      this.currentProductPrices[index] = newTotalPrice;
      this.currentProductQuantities[index] = newQty;
      this.currentCOD = COD;
    } else {
      this.qtyValid = false;
    }
  }

  setProductsConfirmQty(products) {
    this.productList = this.changeOrderStatusForm.get(
      "productList"
    ) as FormArray;
    products.forEach((item, index) => {
      let productColorName;
      let productSize;
      if (item.attributes && item.attributes.length > 0) {
        const colorObject = item.attributes.filter(
          (attribute) => attribute.type === "color"
        )[0];
        const filteredColor = COLOR_VARIANTS.filter(
          (color) => colorObject && colorObject.value === color.color
        )[0];
        productColorName = filteredColor ? filteredColor.arabicColorName : "";
        productSize = item.attributes.filter(
          (attribute) => attribute.type === "size"
        )[0]?.value;
      }
      this.productList.push(
        this.createProduct(
          `${this.data.productIds[index]} - ${item.productName}${
            productColorName ? "- " + productColorName : ""
          }${productSize ? "- " + productSize : ""}`,
          this.data.productQuantities[index]
        )
      );
    });
  }

  setProductsReturnQty(products) {
    this.productReturnReplaceQuantities = this.changeOrderStatusForm.get(
      "productReturnReplaceQuantities"
    ) as FormArray;
    products.forEach((item, index) => {
      this.productReturnReplaceQuantities.push(
        this.createProduct(
          `${this.data.productIds[index]} - ${item.productName}`,
          this.data.productQuantities[index]
        )
      );
      if (this.data.productQuantities[index] == 0)
        this.productReturnReplaceQuantities.controls[index]["controls"][
          "qty"
        ].disable();
    });
  }

  setProductsReplaceQty(products) {
    this.productReturnReplaceQuantities = this.changeOrderStatusForm.get(
      "productReturnReplaceQuantities"
    ) as FormArray;
    products.forEach((item, index) => {
      this.productReturnReplaceQuantities.push(
        this.createProduct(
          `${this.data.productIds[index]} - ${item.productName}`,
          this.data.productReturnQuantities[index]
        )
      );
      if (this.data.productReturnQuantities[index] == 0)
        this.productReturnReplaceQuantities.controls[index]["controls"][
          "qty"
        ].disable();
    });
  }

  prepareOrderDataForReturnReplace(newStatus) {
    //, prodQty, originalQty=null, returnQty=null, replacedQty=null){

    //returnInProgress
    if (newStatus == "return_in_progress") {
      this.calculateReturnQty();
    }

    //returnVerified
    else if (newStatus == "return_verified") {
      this.calculateOrderProfitForReturn();
    }

    //replacementInProgress
    else if (newStatus == "replacement_in_progress") {
      this.calculateReplaceQty();
    }

    //replacement_verified
    else if (newStatus == "replacement_verified") {
      this.calculateOrderProfitForReplace();
    }
  }

  calculateReturnQty() {
    this.productReturnReplaceQuantities = this.changeOrderStatusForm.get(
      "productReturnReplaceQuantities"
    ) as FormArray;
    this.productReturnReplaceQuantities.controls.forEach((element, index) => {
      let returnQty = element["controls"]["qty"].value;
      if (returnQty > this.data.productQuantities[index])
        returnQty = this.data.productQuantities[index];
      this.productReturnQuantities[index] = returnQty;
    });
  }

  calculateOrderProfitForReturn() {
    this.data.productReturnQuantities.forEach((returnQty, index) => {
      if (this.data.productQuantities[index] != 0) {
        //get previous total price (per product) and qty
        const totalPrice = this.data.productPrices[index];
        const qty = this.data.productQuantities[index];

        let newQty = qty - returnQty;

        //get new total price (per product)
        const productOrderPrice =
          this.data.productPrices[index] / this.data.productQuantities[index];
        const newTotalPrice = productOrderPrice * newQty;

        //calculate product profit on order
        const productActualProfit = this.products[index].productProfit;
        const productActualPrice = this.products[index].productPrice;
        const productorderProfit =
          this.data.productProfits && this.data.productProfits.length > 0
            ? this.data.productProfits[index]
            : productOrderPrice - productActualPrice + productActualProfit;

        //calculate previous profit change
        const productOrderTotalProfit = productorderProfit * qty;

        //calculate new profit change
        const productOrderTotalNewProfit = productorderProfit * newQty;

        //calculate new profit, quantities, total prices (per product), COD
        this.profit =
          this.profit - productOrderTotalProfit + productOrderTotalNewProfit;
        if (this.profit == 0) {
          this.calculatedProfit = true;
        }
        this.currentCOD = this.currentCOD - totalPrice + newTotalPrice;
      }
    });
  }

  calculateReplaceQty() {
    this.productReturnReplaceQuantities = this.changeOrderStatusForm.get(
      "productReturnReplaceQuantities"
    ) as FormArray;
    this.productReturnReplaceQuantities.controls.forEach((element, index) => {
      let replaceQty = element["controls"]["qty"].value;
      if (replaceQty > this.data.productReturnQuantities[index])
        replaceQty = this.data.productReturnQuantities[index];
      this.productReplacedQuantities[index] = replaceQty;
    });
  }

  calculateOrderProfitForReplace() {
    this.data.productReplacedQuantities.forEach((replaceQty, index) => {
      //get previous total price (per product) and qty
      // const totalPrice = this.data.productPrices[index];
      //const qty = this.data.productQuantities[index];

      // let newQty = qty - this.data.productReturnQuantities[index] + replaceQty;

      //get new total price (per product)
      if (this.data.productQuantities[index] != 0) {
        const productOrderPrice =
          this.data.productPrices[index] / this.data.productQuantities[index];
        const replacePrice = productOrderPrice * replaceQty;

        //calculate product profit on order
        const productActualProfit = this.products[index].productProfit;
        const productActualPrice = this.products[index].productPrice;
        const productorderProfit =
          this.data.productProfits && this.data.productProfits.length > 0
            ? this.data.productProfits[index]
            : productOrderPrice - productActualPrice + productActualProfit;

        //calculate previous profit change
        // const productOrderTotalProfit = productorderProfit * qty;

        //calculate new profit change
        const productOrderReplaceProfit = productorderProfit * replaceQty;

        //calculate new profit, quantities, total prices (per product), COD
        this.profit = this.profit + productOrderReplaceProfit;

        this.currentCOD = this.currentCOD + replacePrice;
      }
    });
  }

  failAttempt() {
    if (this.changeOrderStatusForm.value.failedAttemptNote != "") {
      this.clicked = true;
      const failAttempt = {
        count: this.data.failedAttemptsCount + 1,
        note: this.changeOrderStatusForm.value.failedAttemptNote,
        orderID: this.data._id,
      };

      this.orderService.failAttempt(failAttempt).subscribe(
        (res: any) => {
          this.changeOrderStatusForm.patchValue({
            failedAttemptsCount: failAttempt.count,
          });

          this.toastr.success(res.msg);
        },
        (err) => {
          this.toastr.error(err.error.msg);
        }
      );
    } else {
      this.clicked = false;
      this.toastr.error("Please enter the failed Attempt note");
    }
  }
  filterItem() {
    let search = this.zonesFilterCtrl.value;
    if (!search) {
      this.zones = this.originalZones;
      return 0;
    }
    this.zones = this.originalZones.filter((a) => a.startsWith(search));
  }
  preferredDeliveryDatePickerFilter = (d: Date | null): boolean => {
    // not before today
    return !moment(d).isBefore(moment());
  };
}
