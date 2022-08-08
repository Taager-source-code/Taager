import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { COLOR_VARIANTS } from "../../../shared/constants/variants";
import { ShippingService } from "../../services/shipping.service";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-shipping-bulk-child-orders",
  templateUrl: "./shipping-bulk-child-orders.component.html",
  styleUrls: ["./shipping-bulk-child-orders.component.scss"],
})
export class ShippingBulkChildOrdersComponent implements OnInit {
  public Orders = [];
  public selectedCountry: string = "";
  public filter = {
    fromDate: "",
    toDate: "",
    status: "",
  };
  public description = "";
  public Order: any = {};
  public shippingCompany = "";
  public status = "";
  public productDescriptions: { [key: string]: any } = {};
  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private productService: ProductService,
    private shippingService: ShippingService,
    private utilityService: UtilityService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.shippingCompany = "bosta";
    this.status = "all";
  }

  public OnFromDateChange(event): void {
    this.filter.fromDate = event;
  }

  public OnToDateChange(event): void {
    this.filter.toDate = event;
  }

  public OnStatusChange(event): void {
    this.filter.status = event;
  }

  getSelectedCountry(country: string) {
    this.selectedCountry = country;
  }

  downloadTemplate() {
    this.spinner.show();

    if (this.shippingCompany == "bosta") {
      this.downloadBostaTemplate();
    } else {
      this.toastr.error("A shipping company must be choosed");
    }
  }

  downloadBostaTemplate() {
    this.orderService
      .getChildOrderStatusExtract(this.filter, this.selectedCountry)
      .subscribe(
        async (res: any) => {
          this.Orders = res.data;
          // set the product description in local cache
          await this.setProductDescriptions(
            Array.from(this.getProductIdsSet(this.Orders))
          );
          var orders = this.Orders.map((order) => ({
            Business_Reference: order.orderID,
            Receiver_Name: order.receiverName
              ? order.receiverName.replaceAll(",", "")
              : "",
            Phone: order.phoneNumber,
            "Phone 2": order.phoneNumber2,
            Type: this.getBostaShipmentType(order.orderID),
            "City Code": this.matchBostaProvinces(order.province),
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
      ),
      (err) => {
        this.hideSpinner();
      };
  }

  getDescription = (order) => {
    return new Promise((resolve) => {
      this.productService.getProductsByIds(order["products"]).subscribe(
        async (res: any) => {
          let c = 0;
          this.description = "";
          await res.data.forEach((product) => {
            if (product) {
              let productColorName;
              let productSize;
              if (product.attributes && product.attributes.length > 0) {
                const colorObject = product.attributes.filter(
                  (attribute) => attribute.type === "color"
                )[0];
                const filteredColor = COLOR_VARIANTS.filter(
                  (color) => colorObject && colorObject.value === color.color
                )[0];
                productColorName = filteredColor
                  ? filteredColor.arabicColorName
                  : "";
                productSize = product.attributes.filter(
                  (attribute) => attribute.type === "size"
                )[0]?.value;
              }
              this.description +=
                product.prodID +
                "/" +
                product.productName +
                `${productColorName ? "- " + productColorName : ""}${
                  productSize ? "- " + productSize : ""
                }` +
                "/ ( Quantity:" +
                order["productQuantities"][c] +
                ") ------ ";
            }
            c++;
          });
          resolve(this.description);
        },
        () => {
          this.hideSpinner();
        }
      );
    });
  };

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
                (color) => colorObject.value === color.color
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
    let productDescription =
      this.productDescriptions[order.product.productObjectId] || "";
    if (order.product.productQty > 0) {
      productDescription += "/ ( Quantity:" + order.product.productQty + ")";
    }
    return productDescription.replaceAll(",", "");
  }
  getProductIdsSet(orders): Set<string> {
    const orderProductIds: string[] = orders.map(
      (order) => order.product.productObjectId
    );
    const productIdsSet = new Set(orderProductIds);
    return productIdsSet;
  }

  onSendFile(event) {
    this.spinner.show();

    if (this.shippingCompany == "bosta") {
      this.onSendBostaFile(event);
    } else {
      this.hideSpinner();
      this.toastr.error("A shipping company must be choosed");
    }
  }

  onSendBostaFile(event) {
    const {
      target: { files },
    } = event;

    const file = files[0];
    const fr = new FileReader();
    fr.readAsText(file);

    fr.onload = (e) => {
      const content = e.target.result.toString();
      const lines = content.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",");

      const errors = [];

      if (headers.length < 8) {
        errors.push({
          row: "Ø§Ù„ÙƒÙ„",
          error: "ØªÙ†Ø³ÙŠÙ‚ Ù…Ù„Ù ØºÙŠØ± ØµØ§Ù„Ø­ (Ø£Ø¹Ù…Ø¯Ø© Ù…ÙÙ‚ÙˆØ¯Ø©)",
        });
      } else {
        for (let indx = 1; indx < lines.length; indx++) {
          const element = lines[indx];
          const values = element.split(",");
          const pickupAddress = {
            firstLine: values[7],
            city: values[5],
          };
          const dropOffAddress = {
            firstLine: values[7],
            city: values[5],
          };
          const receiver = {
            firstName: values[1],
            lastName: ".",
            phone: values[2],
          };
          const shipmentType = this.getBostaShipmentType(values[0]);
          const Delivery = {
            pickupAddress: pickupAddress,
            dropOffAddress: dropOffAddress,
            receiver: receiver,
            cod: values[8],
            type: shipmentType,
            allowToOpenPackage: this.allowToOpenPackage(values[11]),
            businessReference: values[0],
            specs: {
              packageDetails: {
                description: values[9],
              },
            },
            notes: values[10] + "----" + values[3],
          };
          if (!Delivery.businessReference) {
            this.toastr.error(
              "Please enter Business Reference Id for all orders"
            );
            this.spinner.hide();
          } else if (
            !Delivery.dropOffAddress.city ||
            !Delivery.dropOffAddress.firstLine
          ) {
            this.toastr.error("Please enter City & Address for all orders");
            this.spinner.hide();
          } else {
            this.shippingService.addOrderToBosta(Delivery).subscribe(
              (res) => {
                const logData = {
                  orderID: values[0],
                  payload: res,
                };

                this.orderService.createBostaLog(logData).subscribe(() => {});

                const shippingInfo = {
                  trackingNumber: res.data.trackingNumber,
                  packageId: res.data._id,
                  company: "bosta",
                };

                this.updateChildOrderStatus(values[0], shippingInfo);

                if (!values[0].startsWith("R")) {
                  const formData = {
                    packageId: res.data._id,
                  };
                  this.shippingService
                    .getAWBFromBosta(formData)
                    .subscribe((res) => {
                      this.hideSpinner();
                    });
                }
              },
              (err) => {
                const logData = {
                  orderID: values[0],
                  payload: err,
                };
                this.orderService.createBostaLog(logData).subscribe(() => {});
                this.toastr.error(err.error?.msg);
                this.spinner.hide();
              }
            );
          }
        }
      }
    };
  }

  async updateChildOrderStatus(orderID, shippingInfo) {
    const orderIdsArray = [];
    orderIdsArray.push(orderID);
    this.orderService
      .viewChildOrdersWithIDs(orderIdsArray)
      .subscribe(async (res) => {
        this.Order["orders"] = [
          {
            _id: res.data[0]._id,
            orderID: res.data[0].orderID,
            parentOrderObjectId: res.data[0].parentOrderObjectId,
          },
        ];
        this.Order["shippingInfo"] = shippingInfo;
        this.Order["status"] = "pending_shipping_company";

        this.orderService.updateChildOrderStatusCustom(this.Order).subscribe(
          (res: any) => {
            this.toastr.success(res.msg);
          },
          () => {
            this.toastr.error(
              "An error occurred in Order:" + res.data[0].orderID
            );
          }
        );
      });
  }

  matchBostaProvinces(province) {
    let city = "";
    switch (province) {
      case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©":
        city = "EG-01";
        break;
      case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©":
        city = "EG-01";
        break;
      case "Ø§Ù„Ù‚Ø·Ø§Ù…ÙŠØ©":
        city = "EG-01";
        break;
      case "Ø§Ù„Ø¹Ø¨ÙˆØ±":
        city = "EG-01";
        break;
      case "Ø§Ù„Ø´Ø±ÙˆÙ‚":
        city = "EG-01";
        break;
      case "Ø¨Ø¯Ø±":
        city = "EG-01";
        break;
      case "Ø§Ù„Ø±Ø­Ø§Ø¨":
        city = "EG-01";
        break;
      case "Ø­Ù„ÙˆØ§Ù†":
        city = "EG-01";
        break;
      case "15 Ù…Ø§ÙŠÙˆ":
        city = "EG-01";
        break;
      case "ØªØ¨ÙŠÙ†":
        city = "EG-01";
        break;
      case "Ø´Ø¨Ø±Ø§ Ù…ØµØ±":
        city = "EG-01";
        break;
      case "Ø´Ø¨Ø±Ø§ Ø§Ù„Ø®ÙŠÙ…Ø©":
        city = "EG-01";
        break;
      case "Ø§Ù„Ø¬ÙŠØ²Ø©":
        city = "EG-01";
        break;
      case "6 Ø§ÙƒØªÙˆØ¨Ø±":
        city = "EG-01";
        break;
      case "Ø§Ø¨Ùˆ Ø±ÙˆØ§Ø´":
        city = "EG-01";
        break;
      case "Ø¨Ø±Ø¬ Ø§Ù„Ø¹Ø±Ø¨":
        city = "EG-02";
        break;
      case "Ø§Ù„Ø£Ø³ÙƒÙ†Ø¯Ø±ÙŠØ©":
        city = "EG-02";
        break;
      case "Ø¨Ø¯Ø±Ø´ÙŠÙ†":
        city = "EG-01";
        break;
      case "Ø§Ù„Ø­ÙˆØ§Ù…Ø¯ÙŠØ©":
        city = "EG-01";
        break;
      case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø³Ø§Ø¯Ø§Øª":
        city = "EG-09";
        break;
      case "Ø§Ù„Ø§Ø³Ù…Ø§Ø¹ÙŠÙ„ÙŠØ©":
        city = "EG-11";
        break;
      case "Ø¨ÙˆØ± Ø³Ø¹ÙŠØ¯":
        city = "EG-13";
        break;
      case "Ø³ÙˆÙŠØ³":
        city = "EG-12";
        break;
      case "Ø§Ù„ØºØ±Ø¨ÙŠØ©":
        city = "EG-07";
        break;
      case "Ø·Ù†Ø·Ø§":
        city = "EG-07";
        break;
      case "Ø§Ù„Ø¯Ù‚Ù‡Ù„ÙŠØ©":
        city = "EG-05";
        break;
      case "Ø§Ù„Ù‚Ù„ÙŠÙˆØ¨ÙŠØ©":
        city = "EG-06";
        break;
      case "Ø§Ù„Ø¨Ø­ÙŠØ±Ø©":
        city = "EG-04";
        break;
      case "Ø§Ù„Ø¹Ø§Ø´Ø± Ù…Ù† Ø±Ù…Ø¶Ø§Ù†":
        city = "EG-10";
        break;
      case "Ø§Ù„Ø´Ø±Ù‚ÙŠØ©":
        city = "EG-10";
        break;
      case "Ø§Ù„ÙÙŠÙˆÙ…":
        city = "EG-15";
        break;
      case "ÙƒÙØ± Ø§Ù„Ø´ÙŠØ®":
        city = "EG-08";
        break;
      case "Ø¯Ù…ÙŠØ§Ø·":
        city = "EG-14";
        break;
      case "Ø§Ù„Ù…Ø­Ù„Ø©":
        city = "EG-07";
        break;
      case "Ø§Ù„Ù…Ù†ÙˆÙÙŠØ©":
        city = "EG-09";
        break;
      case "Rest of Delta Cities":
        city = "EG-14";
        break;
      case "ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù†Ø·Ø±ÙˆÙ†":
        city = "EG-04";
        break;
      case "Ø¨Ù†ÙŠ Ø³ÙˆÙŠÙ":
        city = "EG-16";
        break;
      case "Ù…Ù†ÙŠØ§":
        city = "EG-19";
        break;
      case "Ø§Ø³ÙŠÙˆØ·":
        city = "EG-17";
        break;
      case "Ø³ÙˆÙ‡Ø§Ø¬":
        city = "EG-18";
        break;
      case "Ù‚Ù†Ø§":
        city = "EG-20";
        break;
      case "Ø§Ù„Ø£Ù‚ØµØ±":
        city = "EG-22";
        break;
      case "Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø£Ø­Ù…Ø± / Ø§Ù„ØºØ±Ø¯Ù‚Ø©":
        city = "EG-23";
        break;
      case "Ø£Ø³ÙˆØ§Ù†":
        city = "EG-21";
        break;
      case "North Coast":
        city = "EG-03";
        break;
      case "Matrouh":
        city = "EG-03";
        break;
      case "Ain-Sokhna":
        city = "EG-12";
        break;
    }
    return city;
  }

  hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 0);
  }

  uint8ArrayToBase64(byte) {
    let u8 = new Uint8Array(byte);
    let decoder = new TextDecoder("utf8");
    let b64encoded = btoa(unescape(encodeURIComponent(decoder.decode(u8))));
    return b64encoded;
  }

  saveByteArray(reportName, byte) {
    let blob = new Blob([byte], { type: "application/pdf" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    let fileName = reportName;
    link.download = fileName;
    link.click();
  }

  base64ToArrayBuffer(base64) {
    let binaryString = window.atob(base64);
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      let ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  getBostaShipmentType = (order) => {
    let type = 10;
    if (order.startsWith("S")) {
      type = 10;
    } else if (order.startsWith("R")) {
      type = 25;
    } else if (order.startsWith("M")) {
      type = 30;
    }
    return type;
  };

  allowToOpenPackage(isAllowed) {
    const value = String(isAllowed);
    let allow = false;
    if (
      value == "true\r" ||
      value == "true" ||
      value == "True" ||
      value == "True\r" ||
      value == "TRUE" ||
      value == "TRUE\r" ||
      value == "yes" ||
      value == "yes\r" ||
      value == "Yes" ||
      value == "Yes\r" ||
      value == "YES" ||
      value == "YES\r"
    ) {
      allow = true;
    }
    return allow;
  }
}
