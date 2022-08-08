import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { ShippingService } from "../../services/shipping.service";
import { UtilityService } from "../../services/utility.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { COLOR_VARIANTS } from "../../../shared/constants/variants";
import { matchProvinces } from "../../../shared/utilities/matchProvinces";
import {
  ARAMEX,
  R2S,
  SAME_BOSTA_INTEGRATED_COMPANIES,
  shippingCompanies,
  VHUBS,
} from "../../../shared/constants/shipping-companies";
import { MatDialog } from "@angular/material/dialog";
import { BULK_UPLOAD } from "../../../shared/constants/upload-type";
import { ConfirmFileUploadDialogComponent } from "../confirm-file-upload-dialog/confirm-file-upload-dialog.component";
import {
  FILE_NOT_UTF_8_ERROR_MESSAGE,
  MISSING_SHIPPING_COMPANY_ERROR,
} from "../../../shared/constants/toaster-messages";
import { finalize } from "rxjs/operators";
declare const require: any;
export const Encoding = require("encoding-japanese");

@Component({
  selector: "app-shipping-bulk-orders",
  templateUrl: "./shipping-bulk-orders.component.html",
  styleUrls: ["./shipping-bulk-orders.component.scss"],
})
export class ShippingBulkOrdersComponent implements OnInit {
  public orders = [];
  public selectedCountry: string = "";
  public filter = {
    status: "confirmed",
    country: "",
    fromDate: "",
    toDate: "",
    extract: true,
    zone: true,
  };
  public selectedShippingCompany = "";
  public productDescriptions: { [key: string]: string } = {};
  shippingCompanies = shippingCompanies;
  public fileUploadConfirmData;
  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private productService: ProductService,
    private shippingService: ShippingService,
    private utilityService: UtilityService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  public OnFromDateChange(event): void {
    this.filter.fromDate = event;
  }
  public OnToDateChange(event): void {
    this.filter.toDate = event;
  }

  getTotalProductQuantity = (order) => {
    return order.productQuantities.reduce((acc, next) => acc + next);
  };

  downloadTemplate() {
    this.spinner.show();
    if (
      SAME_BOSTA_INTEGRATED_COMPANIES.includes(this.selectedShippingCompany)
    ) {
      this.downloadBostaTemplate();
    } else if (this.selectedShippingCompany === ARAMEX) {
      this.downloadAramexTemplate();
    } else if (this.selectedShippingCompany === VHUBS) {
      this.downloadVHubsTemplate();
    } else {
      this.toastr.error("A shipping company must be chosen");
    }
  }
  async setProductDescriptions(productIds: string[]) {
    return this.productService
      .getProductsByIds(productIds)
      .toPromise()
      .then((res: any) => {
        res.data.forEach((element) => {
          if (element) {
            let productColorName;
            let productSize;
            if (element.attributes && element.attributes.length > 0) {
              const colorObject = element.attributes.filter(
                (attribute) => attribute.type === "color"
              )[0];
              const filteredColor = COLOR_VARIANTS.filter(
                (color) => colorObject && colorObject.value === color.color
              )[0];
              productColorName = filteredColor
                ? filteredColor.arabicColorName
                : "";
              productSize = element.attributes.filter(
                (attribute) => attribute.type === "size"
              )[0]?.value;
            }
            let productDescription =
              element.prodID +
              "/" +
              element.productName +
              `${productColorName ? "- " + productColorName : ""}${
                productSize ? "- " + productSize : ""
              }`;
            this.productDescriptions[element._id] = productDescription;
          }
        });
      })
      .catch((err) => {
        this.hideSpinner();
      });
  }
  getOrderDescription(order): string {
    return order.products
      .map((productId, index) => {
        let productDescription = "";
        if (order["productQuantities"][index] > 0) {
          productDescription += this.productDescriptions[productId] || "";
          productDescription +=
            "/ ( Quantity:" + order["productQuantities"][index] + ")";
        }
        return productDescription;
      })
      .join(" ------ ")
      .replaceAll(",", "");
  }
  getProductIdsSet(orders) {
    const flattened = (arr) => [].concat(...arr);
    const orderProductIds = flattened(orders.map((item) => item.products));
    const productIdsSet = new Set(orderProductIds);
    return productIdsSet;
  }
  getSelectedCountry(country: string) {
    this.selectedCountry = country;
    this.filter.country = country;
  }
  downloadBostaTemplate() {
    this.orderService.getOrderStatusExtract(this.filter).subscribe(
      async (res: any) => {
        this.orders = res.data;
        // set the product description in local cache
        await this.setProductDescriptions(
          Array.from(this.getProductIdsSet(this.orders))
        );
        var orders = this.orders.map((order) => ({
          Business_Reference: order.orderID,
          Receiver_Name: order.receiverName
            ? order.receiverName.replaceAll(",", "")
            : "",
          Phone: order.phoneNumber,
          "Phone 2": order.phoneNumber2,
          Type: "Package Delivery",
          "City Code": matchProvinces(order.province),
          City: order.province,
          Address_First_Line: order.streetName
            ? order.streetName
                .replaceAll(",", "")
                .replace(/(?:\r\n|\r|\n|\\)/g, " ")
            : "",
          COD_Amount: order.cashOnDelivery,
          Description: this.getOrderDescription(order),
          Notes: order.shippingNotes
            ? order.shippingNotes.replaceAll(",", "")
            : "",
          Allow_To_Open_Package: "no",
          zone_name:
            order.zone && order.zone.name
              ? order.zone.name.replaceAll(",", "")
              : "",
          zone_status: order.zone.status,
          total_quantity: this.getTotalProductQuantity(order),
        }));

        if (!orders || !orders.length) {
          this.hideSpinner();
          return;
        }
        this.utilityService.extractToExcel(orders, "bulk_orders.csv");
        this.hideSpinner();
      },
      (err) => {
        this.hideSpinner();
      }
    );
  }

  downloadAramexTemplate() {
    this.orderService.getOrderStatusExtract(this.filter).subscribe(
      async (res: any) => {
        this.orders = res.data;
        // set the product description in local cache
        await this.setProductDescriptions(
          Array.from(this.getProductIdsSet(this.orders))
        );
        var orders = this.orders.map((order) => ({
          Business_Reference: order.orderID,
          Receiver_Name: order.receiverName
            ? order.receiverName.replaceAll(",", "")
            : "",
          Phone: order.phoneNumber,
          "Phone 2": order.phoneNumber2,
          Type: "Package Delivery",
          "City Code": this.getAramexCity(order),
          City: order.province,
          Address_First_Line: order.streetName
            ? order.streetName
                .replaceAll(",", "")
                .replace(/(?:\r\n|\r|\n|\\)/g, " ")
            : "",
          COD_Amount: order.cashOnDelivery,
          Description: this.getOrderDescription(order),
          Notes: order.shippingNotes
            ? order.shippingNotes.replaceAll(",", "")
            : "",
          zone_name:
            order.zone && order.zone.name
              ? order.zone.name.replaceAll(",", "")
              : "",
          zone_status: order.zone.status,
        }));
        if (!orders || !orders.length) {
          this.hideSpinner();
          return;
        }
        this.utilityService.extractToExcel(orders, "bulk_orders.csv");

        this.hideSpinner();
      },
      (err) => {
        this.hideSpinner();
      }
    );
  }

  downloadVHubsTemplate() {
    this.orderService.getOrderStatusExtract(this.filter).subscribe(
      async (res: any) => {
        this.orders = res.data;
        await this.setProductDescriptions(
          Array.from(this.getProductIdsSet(this.orders))
        );
        var orders = this.orders.map((order) => ({
          Business_Reference: order.orderID,
          Receiver_Name: order.receiverName
            ? order.receiverName.replaceAll(",", "")
            : "",
          Phone: order.phoneNumber,
          "Phone 2": order.phoneNumber2,
          Type: "Package Delivery",
          "City Code": matchProvinces(order.province),
          City: order.province,
          Address_First_Line: order.streetName
            ? order.streetName
                .replaceAll(",", "")
                .replace(/(?:\r\n|\r|\n|\\)/g, " ")
            : "",
          COD_Amount: order.cashOnDelivery,
          Description: this.getOrderDescription(order),
          Notes: order.shippingNotes
            ? order.shippingNotes.replaceAll(",", "")
            : "",
        }));

        if (!orders || !orders.length) {
          this.hideSpinner();
          return;
        }
        this.utilityService.extractToExcel(orders, "bulk_orders.csv");

        this.hideSpinner();
      },
      () => {
        this.hideSpinner();
      }
    );
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
  async updateOrderStatus(orderID, shippingInfo) {
    var orderIdsArray = [];
    orderIdsArray.push(orderID);
    this.orderService
      .viewOrdersWithIDs(orderIdsArray)
      .subscribe(async (res) => {
        let order = res.data[0];
        order.orders = [
          {
            _id: res.data[0]._id,
            orderID: res.data[0].orderID,
            status: res.data[0].status,
            orderProfit: res.data[0].orderProfit,
            orderedBy: res.data[0].orderedBy,
            isOrderVerified: res.data[0].isOrderVerified,
          },
        ];
        order.shippingInfo = shippingInfo;
        order.status = "pending_shipping_company";
        this.orderService.updateOrderStatusCustom(order).subscribe(
          (res: any) => {
            this.toastr.success(res.msg);
          },
          (err) => {
            this.toastr.error(
              "An error occurred in Order:" + res.data[0].orderID
            );
          }
        );
      });
  }

  confirmFileUpload(event) {
    if (this.selectedShippingCompany === "") {
      this.toastr.error(MISSING_SHIPPING_COMPANY_ERROR);
    } else {
      const file = event.currentTarget.files[0];
      this.utilityService
        .detectEncoding(event.currentTarget.files[0])
        .subscribe((encoding) => {
          if (encoding !== "UTF8") {
            this.toastr.error(FILE_NOT_UTF_8_ERROR_MESSAGE);
            this.spinner.hide();
          } else {
            const fr = new FileReader();
            fr.readAsText(file);
            fr.onload = (e) => {
              const content = e.target.result.toString();
              const lines = content.split("\n").filter((line) => line.trim());
              const headers = lines[0].split(",");
              if (headers.length < 8) {
                this.toastr.error("ØªÙ†Ø³ÙŠÙ‚ Ù…Ù„Ù ØºÙŠØ± ØµØ§Ù„Ø­ (Ø£Ø¹Ù…Ø¯Ø© Ù…ÙÙ‚ÙˆØ¯Ø©)");
                this.spinner.hide();
              } else {
                let fileData = {
                  file,
                  uploadType: BULK_UPLOAD,
                  shippingCompany: this.selectedShippingCompany,
                };
                const dialogRef = this.dialog.open(
                  ConfirmFileUploadDialogComponent,
                  {
                    width: "600px",
                    data: fileData,
                  }
                );
                dialogRef.afterClosed().subscribe((result) => {
                  if (result.type === "confirm") {
                    this.fileUploadConfirmData = result;
                    this.onSendFile();
                  }
                });
              }
            };
          }
        });
    }
  }
  onSendFile() {
    if (this.selectedShippingCompany) {
      this.onSendShippingFile();
    } else {
      this.hideSpinner();
      this.toastr.error("A shipping company must be chosen");
    }
  }
  onSendShippingFile() {
    const shipmentsRequestDto = {
      orders: this.fileUploadConfirmData.data,
      shippingCompany: this.selectedShippingCompany,
      country: "EGY",
    };
    this.shippingService
      .createShipments(shipmentsRequestDto)
      .pipe(
        finalize(() => {
          this.hideSpinner();
        })
      )
      .subscribe(
        (res: any) => {
          this.toastr.success(res.data.description);
        },
        ({ error }) => {
          this.toastr.error(
            error.data?.description || error.description || "An Error Occured"
          );
        }
      );
  }

  hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 0);
  }

  uint8ArrayToBase64(byte) {
    var u8 = new Uint8Array(byte);
    var decoder = new TextDecoder("utf8");
    var b64encoded = btoa(unescape(encodeURIComponent(decoder.decode(u8))));
    return b64encoded;
  }

  onSendAramexFile() {
    let values = this.fileUploadConfirmData.values;
    this.shippingService
      .addOrderToAramex(this.fileUploadConfirmData.deliveryData)
      .subscribe(
        (res) => {
          const shippingInfo = {
            trackingNumber: res.shipmentNumber,
            company: "aramex",
          };

          if (res.shipmentLabelFileContents) {
            this.saveByteArrayForAramex(
              `awb-aramex-${values[0]}`,
              res.shipmentLabelFileContents
            );
          }
          this.updateOrderStatus(values[0], shippingInfo);
        },
        (err) => {}
      );
  }

  saveByteArrayForAramex(reportName, byte) {
    var blob = new Blob([new Uint8Array(byte)], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  getAramexCity(order) {
    const province = (order["zone"] && order["zone"]["name"]) || order.province;
    let aramexCityCode = this.utilityService.mapGreenZoneToAramexCity(province);
    // if (!aramexCityCode) {
    //   aramexCityCode = this.utilityService.mapGreenZoneToAramexCity(
    //     order.province
    //   );
    // }
    return aramexCityCode;
  }
}
