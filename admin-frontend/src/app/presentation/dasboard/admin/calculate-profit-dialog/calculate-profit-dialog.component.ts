import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "../../services/profile.service";
import { ProductService } from "../../services/product.service";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-calculate-profit-dialog",
  templateUrl: "./calculate-profit-dialog.component.html",
  styleUrls: ["./calculate-profit-dialog.component.scss"],
})
export class CalculateProfitDialogComponent implements OnInit {
  allOrdersExtract = [];
  zeroProfitOrders = [];
  deletedProducts = [];
  deletedOrderProducts = [];
  extract = {};
  clicked = false;
  filter = { fromDate: "", toDate: "", extract: false };
  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private profileService: ProfileService,
    private productService: ProductService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {}

  public OnFromDateChange(event): void {
    this.filter.fromDate = event;
  }
  public OnToDateChange(event): void {
    this.filter.toDate = event;
  }
  onExtractOrders(): void {
    this.clicked = true;
    this.orderService.getOrderStatusExtract(this.filter).subscribe(
      (res: any) => {
        this.allOrdersExtract = res.data;
      },
      (err) => {
        this.toastr.error(err.error.msg);
      },
      async () => {
        //this.allOrdersExtract.forEach(async element => {
        var c = 0;
        for await (const element of this.allOrdersExtract) {
          if (
            element.orderProfit === 0 &&
            element.status != "return_verified" &&
            element.status != "replacement_verified"
          ) {
            await this.CaclulateProfit(element);
            c++;
          }
        }
        this.clicked = false;
        this.toastr.success("Orders updated successfully");
      }
    );
  }
  getWalletValuesFromOrders(order) {
    const taagerFilter = { TagerID: order.TagerID };
    const walletObj = {
      userID: order.orderedBy,
      totalProfit: 0,
      countOrders: 0,
      eligibleProfit: 0,
      deliveredOrders: 0,
      inprogressProfit: 0,
      inprogressOrders: 0,
      incomingProfit: 0,
      receivedOrders: 0,
    };
    let orders = [];
    this.orderService.getOrdersByTaagerId(taagerFilter).subscribe(
      async (res) => {
        orders = res.data;
        walletObj.countOrders = orders.length;
        //orders.forEach(element => {
        for await (const element of orders) {
          if (
            element.status == "confirmed" ||
            element.status == "pending_shipping_company"
          ) {
            walletObj.totalProfit += element.orderProfit;
            walletObj.incomingProfit += element.orderProfit;
            walletObj.receivedOrders += 1;
          } else if (
            element.status == "delivery_in_progress" ||
            element.status == "return_in_progress" ||
            element.status == "replacement_in_progress" ||
            (element.status == "delivered" && !element.isOrderVerified) ||
            (element.status == "replacement_verified" &&
              !element.isOrderVerified) ||
            (element.status == "return_verified" && !element.isOrderVerified)
          ) {
            walletObj.totalProfit += element.orderProfit;
            walletObj.inprogressProfit += element.orderProfit;
            walletObj.inprogressOrders += 1;
          } else if (
            (element.status == "delivered" && element.isOrderVerified) ||
            (element.status == "replacement_verified" &&
              element.isOrderVerified) ||
            (element.status == "return_verified" && element.isOrderVerified) ||
            element.status == "done"
          ) {
            walletObj.totalProfit += element.orderProfit;
            walletObj.eligibleProfit += element.orderProfit;
            walletObj.deliveredOrders += 1;
          }
        }
      },
      (err) => {},
      () => {
        this.profileService
          .deleteUserWallet(order.orderedBy)
          .subscribe((res) => {
            this.profileService.addUserWallet(walletObj).subscribe((res) => {});
          });
      }
    );
  }

  CaclulateProfit(order) {
    this.productService
      .getProductsByIds(order.products)
      .subscribe(async (res: any) => {
        let products = res.data;
        let profit = 0;

        await order.products.forEach((element, index) => {
          //get previous total price (per product) and qty
          //  if(products[index]) {
          const qty = order.productQuantities[index];

          //get new total price (per product)
          const productOrderPrice =
            order.productPrices[index] / order.productQuantities[index];

          //calculate product profit on order
          const productActualProfit = products[index].productProfit;
          const productActualPrice = products[index].productPrice;
          const productorderProfit =
            productOrderPrice - productActualPrice + productActualProfit;

          //calculate previous profit change
          const productOrderTotalProfit = productorderProfit * qty;

          //calculate new profit, quantities, total prices (per product), COD
          profit = profit + productOrderTotalProfit;
          //  }
          //  else {
          //   this.deletedProducts.push(order.productIds[index]);
          //   this.deletedOrderProducts.push(order);
          //  }
        });
        order.orderProfit = profit;
        // if(order.orderProfit == 0)
        //   this.zeroProfitOrders.push(order);
        this.orderService.updateOrderProfit(order).subscribe((res) => {});
        // this.getWalletValuesFromOrders(order);
      });
  }
  ExportToCRV(orders) {
    if (!orders || !orders) {
      return;
    }
    this.utilityService.extractToExcel(orders, "orders.csv");
  }
}
