import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ShippingService } from "../../services/shipping.service";
import { ProvinceService } from "../../services/province.service";
import { environment } from "../../../../../environments/environment";
import { OrderService } from "../../services/order.service";
import { UtilityService } from "../../services/utility.service";
import { matchProvinces } from "../../../shared/utilities/matchProvinces";
import {
  CASH_COLLECTION,
  CUSTOMER_RETURN_PICKUP,
  EXCHANGE,
  PACKAGE_DELIVERY,
} from "../../../shared/constants/match-shippment-type";

class Order {
  receiverName: string = "";
  orderNum: Number;
  phoneNumber: string = "";
  phoneNumber2: string = "";
  streetName: string = "";
  province: string = "";
  cashOnDelivery: string = "";
  products: any;
  productIds: any;
  orderID: string;
  productQuantities: any;
  notes: string;
  shippingNotes: string;
  TagerID: Number;
  productPrices: any;
  zone: object;
}
@Component({
  selector: "app-add-delivery-package",
  templateUrl: "./add-delivery-package.component.html",
  styleUrls: ["./add-delivery-package.component.scss"],
})
export class AddDeliveryPackageComponent implements OnInit {
  @Input() order: Order;
  @Input() products: any;
  @Input() selectedOrders: any;
  @Input() shippingCompany: string;
  @Input() provinces: any[] = [];
  @Output() submitted: EventEmitter<any> = new EventEmitter();
  public packageForm: FormGroup;
  public itemCount = 0;
  public cities = [];
  public states = [];
  public allcities = [];
  public aramexcities = [];
  public filteredAramexCities = [];
  public city: string = "";
  public packageDelivery = PACKAGE_DELIVERY;
  public cashCollection = CASH_COLLECTION;
  public exchange = EXCHANGE;
  public customerReturnPickup = CUSTOMER_RETURN_PICKUP;
  constructor(
    private shippingService: ShippingService,
    private provinceService: ProvinceService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private utilityService: UtilityService
  ) {
    this.packageForm = new FormGroup({
      shipmentType: new FormControl(),
      allowToOpenPackage: new FormControl(),
      receiverName: new FormControl(),
      phoneNumber: new FormControl(),
      phoneNumber2: new FormControl(),
      address: new FormControl(),
      city: new FormControl(),
      building: new FormControl(),
      cashOnDelivery: new FormControl(),
      serviceType: new FormControl(),
      service: new FormControl(),
      serviceCategory: new FormControl(),
      description: new FormControl(),
      shippingNotes: new FormControl(),
      province: new FormControl(),
    });
  }

  ngOnInit(): void {
    var desc = "";
    var c = 0;
    this.products.forEach((element) => {
      if (element.childOrder) {
        desc +=
          element.prodID +
          "/" +
          element.productName +
          "/ (" +
          element.productQty +
          ") ------ ";
        return;
      }
      desc +=
        element.prodID +
        "/" +
        element.productName +
        "/ (" +
        this.order.productQuantities[c] +
        ") ------ ";
      c++;
      this.itemCount++;
    });
    this.packageForm.patchValue({
      cashOnDelivery: this.order.cashOnDelivery,
      receiverName: this.order.receiverName,
      phoneNumber: this.order.phoneNumber.trim(),
      phoneNumber2: this.order.phoneNumber2.trim(),
      shippingNotes: this.order.shippingNotes,
      address: this.order.streetName + " " + this.order.province,
      description: desc,
      shipmentType: this.getBostaShipmentType(this.order.orderID) || 10,
      allowToOpenPackage: false,
      serviceType: "CTD",
      service: "ND",
      serviceCategory: "DELIVERY",
      province: this.order.province,
    });
    if (this.shippingCompany == "aramex") {
      this.getAramexCities();
      this.matchAramexProvinces();
    } else {
      matchProvinces(this.order.province);
    }
  }
  getAramexCities() {
    this.provinceService.getAllAramexCities().subscribe((res) => {
      this.aramexcities = res.data;
      this.filteredAramexCities = this.matchAramexCitiesWithGreenZones(
        this.provinces,
        this.order.province,
        this.aramexcities
      );
    });
  }
  onStateChange(event) {
    this.cities = this.allcities.filter((value) => {
      return value.stateCode == event.value;
    });
  }
  matchAramexProvinces() {
    let city = "";
    const province =
      (this.order["zone"] && this.order["zone"]["name"]) || this.order.province;
    city = this.utilityService.mapGreenZoneToAramexCity(province);
    this.packageForm.patchValue({
      city: city,
    });
    this.city = city;
  }

  CreateDelivery() {
    if (this.shippingCompany === "bosta") {
      this.CreateBostaDelivery();
    } else if (this.shippingCompany === "aramex") {
      this.createAramexDelivery();
    } else if (this.shippingCompany === "vhubs") {
      this.createVHubsDelivery();
    }
  }
  CreateBostaDelivery() {
    const pickupAddress = {
      firstLine: this.packageForm.get("address").value,
      city: this.packageForm.get("city").value,
    };
    const dropOffAddress = {
      firstLine: this.packageForm.get("address").value,
      city: this.packageForm.get("city").value,
    };
    const receiver = {
      firstName: this.packageForm.get("receiverName").value,
      lastName: ".",
      phone: this.packageForm.get("phoneNumber").value,
    };

    const Delivery = {
      pickupAddress: pickupAddress,
      dropOffAddress: dropOffAddress,
      receiver: receiver,
      cod: this.packageForm.get("cashOnDelivery").value,
      type: this.packageForm.get("shipmentType").value,
      allowToOpenPackage: this.allowToOpenPackage(
        this.packageForm.get("allowToOpenPackage").value
      ),
      businessReference: this.order.orderID,
      specs: {
        packageDetails: {
          //"itemCount": this.itemCount,
          description: this.packageForm.get("description").value,
        },
      },
      notes:
        this.packageForm.get("shippingNotes").value +
        "," +
        this.packageForm.get("phoneNumber2").value,
    };
    this.shippingService.addOrderToBosta(Delivery).subscribe(
      (res) => {
        const shippingInfo = {
          trackingNumber: res.data.trackingNumber,
          packageId: res.data._id,
          company: "bosta",
        };

        if (this.order.orderID.startsWith("R")) {
          this.submitted.emit(shippingInfo);
        } else {
          const formData = {
            packageId: res.data._id,
          };
          this.shippingService.getAWBFromBosta(formData).subscribe((res) => {
            this.saveByteArray("awb", this.base64ToArrayBuffer(res.data.data));
            this.submitted.emit(shippingInfo);
          });
        }
      },
      (err) => {}
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

  saveByteArrayForAramex(reportName, byte) {
    var blob = new Blob([new Uint8Array(byte)], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }
  uint8ArrayToBase64(byte) {
    var u8 = new Uint8Array(byte);
    var decoder = new TextDecoder("utf8");
    var b64encoded = btoa(unescape(encodeURIComponent(decoder.decode(u8))));
    return b64encoded;
  }

  createAramexDelivery() {
    const delivery = {
      address:
        this.packageForm.get("address").value +
        " , " +
        this.packageForm.get("phoneNumber2").value,
      receiver: this.packageForm.get("receiverName").value,
      cashOnDelivery: this.packageForm.get("cashOnDelivery").value,
      orderID: this.order.orderID,
      descriptionOfGoods: this.packageForm.get("description").value,
      city: this.packageForm.get("city").value,
      notes:
        this.packageForm.get("address").value +
          " , " +
          this.packageForm.get("phoneNumber2").value +
          " , " +
          this.packageForm.get("shippingNotes").value || " ",
      phoneNumber1: this.packageForm.get("phoneNumber").value,
      phoneNumber2: this.packageForm.get("phoneNumber2").value,
    };
    if (!this.packageForm.value.city) {
      this.toastr.error("ÙŠØ¬Ø¨ Ø§Ø®ØªÙŠØ§Ø± Ù…Ø¯ÙŠÙ†Ø© Ø´Ø±ÙƒØ© Ø§Ù„Ø´Ø­Ù†");
      return 0;
    }
    this.shippingService.addOrderToAramex(delivery).subscribe(
      (res) => {
        const shippingInfo = {
          trackingNumber: res.shipmentNumber,
          company: "aramex",
        };
        this.saveByteArrayForAramex(
          `awb-aramex-${this.order.orderID}`,
          res.shipmentLabelFileContents
        );
        const formData = {
          delivery_data: {
            order_id: this.order.orderID,
            tracking_id: shippingInfo.trackingNumber,
            delivery_company: "aramex",
            attachment: {
              file_name: `awb-aramex-${this.order.orderID}`,
              content: this.uint8ArrayToBase64(res.shipmentLabelFileContents),
            },
          },
        };
        this.submitted.emit(shippingInfo);
      },
      (err) => {
        if (err.error.errors) {
        }
      }
    );
  }

  createVHubsDelivery() {
    const address = `${this.packageForm.get("address").value} , ${
      this.packageForm.get("phoneNumber2").value
    }`;
    const delivery = {
      address,
      receiver: this.packageForm.get("receiverName").value,
      cashOnDelivery: this.packageForm.get("cashOnDelivery").value,
      orderID: this.order.orderID,
      descriptionOfGoods: this.packageForm.get("description").value,
      city: this.packageForm.get("province").value,
      notes: `${address} , ${
        this.packageForm.get("shippingNotes").value || " "
      }`,
      phoneNumber1: this.packageForm.get("phoneNumber").value,
      phoneNumber2: this.packageForm.get("phoneNumber2").value,
    };
    this.shippingService.addOrderToVHubs(delivery).subscribe(
      (res) => {
        const shippingInfo = {
          trackingNumber: res.shipmentNumber,
          company: "vhubs",
        };
        this.submitted.emit(shippingInfo);
      },
      (err) => {}
    );
  }

  matchAramexCitiesWithGreenZones(provinces, province, aramexcities) {
    const greenZones = provinces
      .filter((prov) => prov.location === province)
      .map((prov) => prov.greenZones);

    const cities = [];

    greenZones[0].forEach((greenZone) => {
      let city = greenZone; // init with greenZone

      city = this.utilityService.mapGreenZoneToAramexCity(city);

      aramexcities.forEach((aramexCity) => {
        if (city === aramexCity) {
          cities.push(aramexCity);
        }
      });
    });

    const uniqueCities = [...new Set(cities)];

    return uniqueCities;
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
