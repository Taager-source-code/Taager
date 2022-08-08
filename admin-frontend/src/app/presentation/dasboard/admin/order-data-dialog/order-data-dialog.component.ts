import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { COLOR_VARIANTS } from "../../../shared/constants/variants";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { UtilityService } from "../../services/utility.service";
export interface Order {
  OrderObj: [];
}

@Component({
  selector: "app-order-data-dialog",
  templateUrl: "./order-data-dialog.component.html",
  styleUrls: ["./order-data-dialog.component.scss"],
})
export class OrderDataDialogComponent implements OnInit {
  OrderObj = this.data.OrderObj;
  orders = [];
  productList = [];
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<OrderDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.getDuplicateOrders();
  }
  getDuplicateOrders() {
    this.getOrderProducts(this.OrderObj);
    for (const element of this.OrderObj["duplicateOrders"]) {
      this.orderService.getOrderById(element).subscribe((res) => {
        var ord = res.data;
        this.getOrderProducts(ord);
      });
    }
  }
  getOrderProducts(ord) {
    this.productService.getProductsByIds(ord.products).subscribe(
      async (res: any) => {
        ord.productsList = [];
        await res.data.forEach((item, index) => {
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
          ord.productsList.push({
            Id: ord.productIds[index],
            name: `${item.productName}${
              productColorName ? "- " + productColorName : ""
            }${productSize ? "- " + productSize : ""}`,
            qty: ord.productQuantities[index],
          });
        });
      },
      (err) => {},
      () => {
        this.orders.push(ord);
      }
    );
  }

  mapNumbersToSuspendedReasons = (number) =>
    this.utilityService.mapNumbersToSuspendedReasons(number);

  mapNumbersToCustomerRejectedReasons = (number) => {
    let customerRejectedReason = "";
    switch (Number(number)) {
      case 1:
        customerRejectedReason = "Ø§ÙˆØ±Ø¯Ø± Ù…ÙƒØ±Ø±";
        break;
      case 2:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø¨ÙŠÙ‚ÙˆÙ„ Ù…Ø·Ù„Ø¨ØªØ´ Ø­Ø§Ø¬Ù‡";
        break;
      case 3:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙŠØ±ÙŠØ¯ Ù…Ù†ØªØ¬ Ù…Ø®ØªÙ„Ù";
        break;
      case 4:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù…Ø³Ø§ÙØ±";
        break;
      case 5:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙŠØ±ÙŠØ¯ Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬Ø§Øª";
        break;
      case 6:
        customerRejectedReason = "Ù„Ø§ ÙŠÙˆØ¬Ø¯ ØªÙˆØµÙŠÙ„ Ù„Ù‡Ø°Ù‡ Ø§Ù„Ù…Ù†Ø·Ù‚Ø©";
        break;
      case 7:
        customerRejectedReason = "Ø§ÙˆØ±Ø¯Ø± Ø®Ø·Ø£ØŒ Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙŠØ±ÙŠØ¯ Ø¥Ø³ØªØ¨Ø¯Ø§Ù„ Ø§Ù„Ù…Ù†ØªØ¬";
        break;
      case 8:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ø³ØªÙ„Ù… Ù…Ù† Ù…ÙƒØ§Ù† Ø¢Ø®Ø±";
        break;
      case 9:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ø´ØªØ±Ù‰ Ù…Ù† Ù…ÙƒØ§Ù† Ø¢Ø®Ø± Ø§Ø³ØªÙ„Ù… Ù…Ù† Ù…ÙƒØ§Ù† Ø¢Ø®Ø±";
        break;
      case 10:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù„Ø§ ÙŠØ­ØªØ§Ø¬ Ø§Ù„Ù…Ù†ØªØ¬";
        break;
      case 11:
        customerRejectedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø±ÙØ¶ ÙŠÙ‚ÙˆÙ„ Ø£Ø³Ø¨Ø§Ø¨ Ø§Ù„Ø¥Ù„ØºØ§Ø¡";
        break;
      case 12:
        customerRejectedReason =
          "ØªØ£Ø¬ÙŠÙ„ Ù„Ø£ÙƒØ«Ø± Ù…Ù† Ø£Ø³Ø¨ÙˆØ¹ØŒ Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨ Ù…Ø±Ù‡ Ø§Ø®Ø±Ù‰ Ø§Ø«Ù†Ø§Ø¡ Ø§Ø­ØªÙŠØ§Ø¬ Ø§Ù„Ø¹Ù…ÙŠÙ„ØŒ Ù‚Ø¨Ù„Ù‡Ø§ Ø¨ÙŠÙˆÙ…ÙŠÙ†";
        break;
      case 13:
        customerRejectedReason = "Ø±ÙØ¶ Ø¨Ø§Ø³Ø¨Ø§Ø¨ Ø´Ø®ØµÙŠÙ‡";
        break;
      case 14:
        customerRejectedReason = "Ø§Ù„ÙƒÙ…ÙŠØ§Øª ÙƒØ¨ÙŠØ±Ù‡";
        break;
      case 15:
        customerRejectedReason = "Ø§Ù„Ø±Ù‚Ù… Ø®Ø·Ø§";
        break;
      default:
        customerRejectedReason = "";
    }
    return customerRejectedReason;
  };
}
