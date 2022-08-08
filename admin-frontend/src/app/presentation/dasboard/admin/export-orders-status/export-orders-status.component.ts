import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ToastrService } from "ngx-toastr";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-export-orders-status",
  templateUrl: "./export-orders-status.component.html",
  styleUrls: ["./export-orders-status.component.scss"],
})
export class ExportOrdersStatusComponent implements OnInit {
  allOrdersExtract = [];
  public selectedCountry: string = "";
  filter = { status: "", fromDate: "", toDate: "", extract: true, country: "" };
  status: string;
  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {}

  public OnFromDateChange(event): void {
    this.filter.fromDate = event;
  }
  public OnToDateChange(event): void {
    this.filter.toDate = event;
  }
  public async extractArray(orders) {
    var extractArray = [];
    for await (const element of orders) {
      extractArray.push({
        "Creation date": element.createdAt,
        "Update date": element.updatedAt,
        "Confirmation date": element.confirmationDate,
        "Order ID": element.orderID,
        "Order Status": element.status,
        "Tager ID": element.TagerID,
        "Customer Name": element.receiverName,
        "Customer Phone": element.phoneNumber,
        "Shipping company": element.shippingInfo
          ? element.shippingInfo.company
          : "",
        "Company Tracking Id": element.shippingInfo
          ? element.shippingInfo.trackingNumber
          : "",
        "Taager Tracking Id": element.trackingId,
        is_verified: element.isOrderVerified,
        province: element.province,
        zone: element.zone ? element.zone.name : "",
        "zone status": element.zone ? element.zone.status : "",
      });
    }
    this.utilityService.extractToExcel(extractArray, "orders.csv");
  }
  getSelectedCountry(country: string) {
    this.selectedCountry = country;
    this.filter.country = country;
  }
  onExtractOrders(): void {
    this.filter.status = this.status;

    this.orderService.getOrderStatusExtract(this.filter).subscribe(
      (res: any) => {
        this.allOrdersExtract = res.data;

        if (!this.allOrdersExtract || !this.allOrdersExtract.length) {
          this.toastr.success("No orders found!");
          return;
        }
        this.toastr.success(res.msg);

        this.extractArray(res.data);
        //this.utilityService.extractToExcel(this.allOrdersExtract, "Orders.csv");
      },
      (err) => {
        this.toastr.error(err.error.msg);
      }
    );
  }
}
