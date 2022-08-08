import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import { FormGroup, FormBuilder, FormArray, FormControl } from "@angular/forms";
import { AddDeliveryPackageComponent } from "../add-delivery-package/add-delivery-package.component";
import { environment } from "src/environments/environment";
interface OrderStatusReq {
  id: string;
  parentOrderObjectId: string;
  parentOrderId: string;
  childOrderID: string;
  status: string;
  trackingId: string;
  orders: [];
  shippingInfo: object;
}

@Component({
  selector: "app-change-child-order-status-dialog",
  templateUrl: "./change-child-order-status-dialog.component.html",
  styleUrls: ["./change-child-order-status-dialog.component.scss"],
})
export class ChangeChildOrderStatusDialogComponent implements OnInit {
  @ViewChild(AddDeliveryPackageComponent) deliveryComp;
  public currentStatus = "pending_shipping_company";
  public changeOrderStatusForm: FormGroup;
  public reqObj = {} as OrderStatusReq;
  clicked = false;
  products: any[] = [];
  public orderID: string;
  public isOrderAddition: boolean = false;
  public isOrderRefund: boolean = false;

  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private dilogRef: MatDialogRef<ChangeChildOrderStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.changeOrderStatusForm = new FormGroup({
      status: new FormControl(),
      shippingCompany: new FormControl({ value: "", disabled: false }),
      trackingId: new FormControl(),
    });

    if (this.data) {
      this.currentStatus = this.data.status;
      this.orderID = this.data.orderID;
      this.products = [
        {
          prodID: this.data.product.productId,
          productName: this.data.product.name,
          productQty: this.data.product.productQty,
          childOrder: true,
        },
      ];
      this.isOrderAddition = this.orderID.startsWith("S");
      this.isOrderRefund = this.orderID.startsWith("R");
    }
  }

  ngOnInit() {}

  submit() {
    if (
      this.changeOrderStatusForm.value.status === "pending_shipping_company" &&
      (this.changeOrderStatusForm.value.shippingCompany == "bosta" ||
        this.changeOrderStatusForm.value.shippingCompany == "aramex")
    ) {
      this.deliveryComp.CreateDelivery();
    } else this.updateStatus();
  }

  public isSubmitEnabled() {
    return this.changeOrderStatusForm.invalid;
  }

  updateStatus(shippingInfo?: Object) {
    this.clicked = true;

    if (this.changeOrderStatusForm.valid && this.changeOrderStatusForm.value) {
      this.reqObj.orders = this.data.selectedOrders;
      this.reqObj.status =
        this.changeOrderStatusForm.value.status || this.currentStatus;
      this.reqObj.trackingId =
        this.changeOrderStatusForm.value.trackingId || undefined;
      this.reqObj.shippingInfo = shippingInfo;

      if (
        this.reqObj.status === "pending_shipping_company" &&
        !shippingInfo &&
        (this.data.orderID.startsWith("S") || this.data.orderID.startsWith("M"))
      ) {
      }

      this.orderService.updateChildOrderStatusCustom(this.reqObj).subscribe(
        (res: any) => {
          this.dilogRef.close();
          this.toastr.success("ØªÙ… ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­");
        },
        (err) => {
          this.clicked = false;
          this.toastr.error("Ø­Ø¯Ø« Ø®Ø·Ø£ Ø§Ø«Ù†Ø§Ø¡ ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø·Ù„Ø¨");
        }
      );
    }
  }
}
