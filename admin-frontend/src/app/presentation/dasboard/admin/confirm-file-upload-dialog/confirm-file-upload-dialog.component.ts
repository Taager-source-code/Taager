import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ALLOW_PACKAGE_OPEN } from "../../../shared/constants/allow-package-open";
import {
  CASH_COLLECTION,
  CUSTOMER_RETURN_PICKUP,
  EXCHANGE,
  PACKAGE_DELIVERY,
} from "../../../shared/constants/match-shippment-type";
import {
  BULK_UPLOAD,
  TRACKING_ID,
} from "../../../shared/constants/upload-type";
import {
  ORDER_SHIPMENT_CREATED_STATUS,
  ORDER_SHIPMENT_DELIVERED,
  ORDER_SHIPMENT_CANCELLED,
} from "../../../shared/constants";
import { ShippingOrder } from "../../../shared/interfaces/shippingOrder";

@Component({
  selector: "app-edit-survey-dialog",
  templateUrl: "./confirm-file-upload-dialog.component.html",
  styleUrls: ["./confirm-file-upload-dialog.component.scss"],
})
export class ConfirmFileUploadDialogComponent implements OnInit {
  ordersData: ShippingOrder[] = [];
  orderCreatedStatus = ORDER_SHIPMENT_CREATED_STATUS;
  orderDeliveredStatus = ORDER_SHIPMENT_DELIVERED;
  orderCancelledStatus = ORDER_SHIPMENT_CANCELLED;
  headers;
  deliveryData;
  constructor(
    public dialogRef: MatDialogRef<ConfirmFileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.processFileData();
  }
  processFileData() {
    const file = this.data.file;
    const fr = new FileReader();
    fr.readAsText(file);
    fr.onload = (e) => {
      const content = e.target.result.toString();
      const lines = content.split("\n").filter((line) => line.trim());
      this.headers = lines[0].split(",");
      for (let indx = 1; indx < lines.length; indx++) {
        const element = lines[indx];
        switch (this.data.uploadType) {
          case TRACKING_ID:
            if (this.data.statusType === ORDER_SHIPMENT_CREATED_STATUS) {
              this.trackingIdsShipmentCreate(element);
            } else if (this.data.statusType === ORDER_SHIPMENT_DELIVERED) {
              this.trackingIdsShipmentDelivered(element);
            } else if (this.data.statusType === ORDER_SHIPMENT_CANCELLED) {
              this.trackingIdsShipmentCancelled(element);
            } else {
              this.trackingIdsShipmentUpdate(element);
            }
            break;
          case BULK_UPLOAD:
            const values = element.split(",");
            this.bulkUploadFileSend(values);
        }
      }
    };
  }
  cancel() {
    this.dialogRef.close("cancel");
  }
  confirm() {
    let params = {
      type: "confirm",
      headers: this.headers,
      data: this.ordersData,
      deliveryData: this.deliveryData,
    };
    this.dialogRef.close(params);
  }
  trackingIdsShipmentCreate(element) {
    const [orderBusinessId, trackingNumber] = element
      .replace(/\r/g, "")
      .split(",");
    this.ordersData.push({
      orderBusinessId,
      trackingNumber,
    });
  }
  trackingIdsShipmentDelivered(element) {
    const [trackingNumber, updatedAt] = element.replace(/\r/g, "").split(",");
    this.ordersData.push({
      trackingNumber,
      updatedAt,
    });
  }
  trackingIdsShipmentCancelled(element) {
    const [trackingNumber, reason] = element.replace(/\r/g, "").split(",");
    this.ordersData.push({
      trackingNumber,
      reason,
    });
  }
  trackingIdsShipmentUpdate(element) {
    const [trackingNumber] = element.replace(/\r/g, "").split(",");
    this.ordersData.push({
      trackingNumber,
    });
  }

  bulkUploadFileSend(values) {
    const [orderBusinessId, notes1, notes2, notes3, allowToOpenPackage] = [
      values[0],
      values[10],
      values[3],
      values[7],
      values[11],
    ];
    this.ordersData.push({
      orderBusinessId,
      notes: `${notes1}"----"${notes2}----${notes3}`,
      allowToOpenPackage: this.allowToOpenPackage(allowToOpenPackage),
    });
  }

  bulkUploadAramexFileSend(values) {
    const [
      orderBusinessId,
      receiver,
      phoneNumber1,
      notes2,
      value4,
      city,
      value6,
      notes3,
      cashOnDelivery,
      descriptionOfGoods,
      notes1,
      allowToOpenPackage,
    ] = values;
    // only for count
    this.ordersData.push({
      orderBusinessId,
      notes: `${notes1}"----"${notes2}----${notes3}`,
      allowToOpenPackage: this.allowToOpenPackage(allowToOpenPackage),
    });

    this.deliveryData = {
      address: notes3,
      receiver,
      cashOnDelivery,
      orderID: orderBusinessId,
      descriptionOfGoods,
      city,
      notes: `${notes1}"----"${notes2}----${notes3}`,
      phoneNumber1,
      phoneNumber2: notes2,
    };
  }

  allowToOpenPackage(isAllowed) {
    const value = String(isAllowed);
    let allow = false;
    if (ALLOW_PACKAGE_OPEN.includes(value.trim().toLowerCase())) {
      allow = true;
    }
    return allow;
  }

  matchShipmentType(type) {
    var code;
    switch (type) {
      case PACKAGE_DELIVERY.name:
        code = PACKAGE_DELIVERY.value;
        break;
      case CASH_COLLECTION.name:
        code = CASH_COLLECTION.value;
        break;
      case CUSTOMER_RETURN_PICKUP.name:
        code = CUSTOMER_RETURN_PICKUP.value;
        break;
      case EXCHANGE.name:
        code = EXCHANGE.value;
        break;
      default:
        code = -1;
        break;
    }
    return code;
  }
}
