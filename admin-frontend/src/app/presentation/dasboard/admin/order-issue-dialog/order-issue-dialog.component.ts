import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { FormGroup, FormControl } from "@angular/forms";
import { NotificationsService } from "../../services/notifications.service";
import { COLOR_VARIANTS } from "../../../shared/constants/variants";

interface OrderIssueReq {
  declineReasons;
}

interface Order {
  orderProfit: number;
  orderID: String;
  status: String;
  createdAt: String;
  receiverName: String;
  phoneNumber: String;
  phoneNumber2: String;
  streetName: String;
  province: String;
  cashOnDelivery: number;
}
@Component({
  selector: "app-order-issue-dialog",
  templateUrl: "./order-issue-dialog.component.html",
  styleUrls: ["./order-issue-dialog.component.scss"],
})
export class OrderIssueDialogComponent implements OnInit {
  public orderIssueForm: FormGroup;
  public reqObj = {} as OrderIssueReq;
  order: Order;
  clicked = false;
  issueReason: String;
  declineReasons: String;
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<OrderIssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationsService: NotificationsService
  ) {
    this.matchIssueReasons();
    this.orderService
      .getOrderById(this.data.orderIssue.order.orderObjectId)
      .subscribe((res) => {
        this.order = res.data;
      });
    this.productService
      .getProductsByIds([this.data.orderIssue.product.productObjectId])
      .subscribe((res) => {
        const item = res.data[0];
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
        this.data.orderIssue.product.name = `${item.productName}${
          productColorName ? "- " + productColorName : ""
        }${productSize ? "- " + productSize : ""}`;
      });
    this.orderIssueForm = new FormGroup({
      declineReasons: new FormControl(),
    });
    this.orderIssueForm.patchValue({
      declineReasons: this.data.orderIssue.declineReasons
        ? this.data.orderIssue.declineReasons
        : "",
    });
    this.declineReasons = this.data.orderIssue.declineReasons
      ? this.data.orderIssue.declineReasons
      : "";
  }

  ngOnInit(): void {}
  getIssueType(type) {
    switch (type) {
      case 1:
        return "Ø§Ø³ØªØ±Ø¬Ø§Ø¹";
        break;
      case 2:
        return "Ø§Ø³ØªØ¨Ø¯Ø§Ù„";
        break;
      case 3:
        return "Ø§Ø³ØªÙƒÙ…Ø§Ù„";
        break;
    }
  }
  matchIssueReasons() {
    switch (this.data.orderIssue.issueReason) {
      case 1:
        this.issueReason = "Ø§Ù„Ù…Ù†ØªØ¬ Ù„Ø§ ÙŠØ¹Ù…Ù„";
        break;
      case 2:
        this.issueReason = "Ù…Ù†ØªØ¬ Ø®Ø§Ø·Ø¦";
        break;
      case 3:
        this.issueReason = "Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ø³ØªØ®Ø¯Ù…";
        break;
      case 4:
        this.issueReason = "Ø¹ÙŠØ¨ ÙÙ‰ Ø§Ù„Ù…Ù†ØªØ¬";
        break;
      case 5:
        this.issueReason = "Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø¨Ø·Ø§Ø±ÙŠØ©";
        break;
      case 6:
        this.issueReason = "Ù†Ù‚Øµ ÙÙ‰ Ù…Ø­ØªÙˆÙŠØ§Øª Ø§Ù„Ø´Ø­Ù†Ø©";
        break;
      case 7:
        this.issueReason = "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø´ÙƒÙ„Ø©";
        break;
    }
  }
  downloadImage(url: string, fileName: string) {
    this.clicked = true;
    const a: any = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = "display: none";
    a.click();
    a.remove();
    this.clicked = false;
  }
  public isSubmitEnabled() {
    return this.orderIssueForm.invalid;
  }
  submit(accept) {
    this.reqObj.declineReasons = this.orderIssueForm.value.declineReasons
      ? this.orderIssueForm.value.declineReasons
      : this.declineReasons;
    this.clicked = true;
    this.data.orderIssue.accept = accept;
    if (this.data.orderIssue.issueType == 1)
      this.data.orderIssue.order.orderProfit =
        this.order.orderProfit - this.data.orderIssue.product.productProfit;
    this.orderService
      .ResolveOrderIssues({
        ...this.data.orderIssue,
        ...this.reqObj,
      })
      .subscribe(
        (res) => {
          if (accept) {
            const orderIssuse = {
              ...res.data,
              product: {
                ...res.data.product,
                name: this.data.orderIssue.product.name,
              },
            };
            this.orderService.createChildOrder(orderIssuse).subscribe(
              (res) => {},
              (err) => {}
            );
          }
          this.dialogRef.close();
          if (accept === false) {
            this.sendNotification(
              this.data.orderIssue.order.OrderId,
              this.reqObj.declineReasons,
              this.data.orderIssue.user.TagerId
            );
          }
        },
        (err) => {
          this.clicked = false;
        }
      );
  }

  sendNotification(orderId, declineReasons, taagerId) {
    const data = {
      title: `ØªÙ… Ø±ÙØ¶ Ø·Ù„Ø¨Ùƒ ${orderId}`,
      message: `ØªÙ… Ø±ÙØ¶ Ø·Ù„Ø¨Ùƒ ${orderId} Ø¨Ø³Ø¨Ø¨ ${declineReasons}`,
      link: `/orders/${orderId}`,
      taagerId: taagerId,
    };

  }
}
