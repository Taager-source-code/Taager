import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
export interface Order {
  OrderObj: [];
}

@Component({
  selector: "app-mergeable-order-dialog",
  templateUrl: "./mergeable-order-dialog.component.html",
  styleUrls: ["./mergeable-order-dialog.component.scss"],
})
export class MergeableOrderDialogComponent implements OnInit {
  OrderObj = this.data.OrderObj;
  orders = [];
  //productList = [];
  selectedOrders = [];
  errorMessages = [];
  clicked = false;
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<MergeableOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {}

  ngOnInit(): void {
    this.getMergeableOrders();
  }
  getMergeableOrders() {
    this.orders = [];
    this.selectedOrders = [];

    for (const element of this.OrderObj["mergeableOrders"]) {
      this.orderService.getOrderById(element).subscribe((res) => {
        if (element.toString() != this.OrderObj["_id"].toString()) {
          var ord = res.data;
          this.getOrderProducts(ord);
        } else {
          this.OrderObj = res.data;
          this.getOrderProducts(this.OrderObj);
        }
      });
    }
  }
  getOrderProducts(ord) {
    this.productService.getProductsByIds(ord.products).subscribe(
      async (res: any) => {
        ord.productsList = [];

        let prods = [];

        if (res.data) {
          await ord.products.forEach((element, index) => {
            prods.push(
              res.data.find((x) => x._id.toString() == element.toString())
            );
          });
        }

        await prods.forEach((item, index) => {
          ord.productsList.push({
            Id: ord.productIds[index],
            name: item.productName,
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

  selectedOrdersValue(event, order) {
    if (event.checked) {
      const filterOrder = this.selectedOrders.filter(
        (x) => x._id === order._id
      );
      if (filterOrder.length === 0) {
        var addOrder = true;
        if (this.selectedOrders.length > 0) {
          if (
            this.selectedOrders[this.selectedOrders.length - 1].status !=
            order.status
          ) {
            addOrder = false;
          }
        }
        // if(addOrder) {
        this.selectedOrders.push({
          order,
        });
        order.selected = true;
      }
    } else {
      const filterOrderIndex = this.selectedOrders.findIndex(
        (x) => x._id === order._id
      );
      if (filterOrderIndex > -1) {
        this.selectedOrders.splice(filterOrderIndex, 1);
        order.selected = false;
      }
    }
  }

  mergeOrders() {
    this.clicked = true;

    let commonProductForOrders = this.commonProductWithDifferentPrice();

    if (commonProductForOrders && commonProductForOrders.length > 0) {
      //show validation error
      this.errorMessages = commonProductForOrders;
      this.clicked = false;
    } else if (this.selectedOrders.length > 0) {
      var notSelectedOrders = this.orders.filter(
        (x) => !this.selectedOrders.map((y) => y.order._id).includes(x._id)
      );
      notSelectedOrders.push(this.OrderObj);

      const mergeOrdersArray = {
        mergeIntoOrder: this.OrderObj,
        mergeableOrders: this.selectedOrders,
        nonMergeableOrders: notSelectedOrders,
      };

      this.orderService.mergeOrders(mergeOrdersArray).subscribe(
        (res) => {
          //update UI
          this.getMergeableOrders();

          //success message
          this.toastr.success(res.msg);
          this.clicked = false;
        },
        (err) => {
          //error message
          this.toastr.error(err.error.msg);
          this.clicked = false;
        }
      );
    } else {
      this.toastr.error("Please select orders to merge");
      this.clicked = false;
    }
  }
  commonProductWithDifferentPrice() {
    let commonProductForOrders = [];

    this.selectedOrders.forEach((orderElement) => {
      var order = orderElement.order;
      order.products.forEach((product, index) => {
        let indx = commonProductForOrders.findIndex(
          (x) => x.id.toString() == order.productIds[index].toString()
        );

        if (indx == -1) {
          commonProductForOrders.push({
            orderId: order.orderID,
            id: order.productIds[index],
            name: order.productsList[index].name,
            price: (
              order.productPrices[index] / order.productQuantities[index]
            ).toString(),
          });
        } else if (
          !commonProductForOrders[indx].price
            .toString()
            .includes(
              (
                order.productPrices[index] / order.productQuantities[index]
              ).toString()
            )
        ) {
          commonProductForOrders[indx].price += `,${(
            order.productPrices[index] / order.productQuantities[index]
          ).toString()}`;
          commonProductForOrders[
            indx
          ].orderId += `,${order.orderId.toString()}`;
        }
      });
    });

    this.OrderObj["products"].forEach((product, index) => {
      let indx = commonProductForOrders.findIndex(
        (x) => x.id.toString() == this.OrderObj["productIds"][index].toString()
      );

      if (indx == -1) {
        commonProductForOrders.push({
          orderId: this.OrderObj["orderID"],
          id: this.OrderObj["productIds"][index],
          name: this.OrderObj["productsList"][index].name,
          price: (
            this.OrderObj["productPrices"][index] /
            this.OrderObj["productQuantities"][index]
          ).toString(),
        });
      } else if (
        !commonProductForOrders[indx].price
          .toString()
          .includes(
            (
              this.OrderObj["productPrices"][index] /
              this.OrderObj["productQuantities"][index]
            ).toString()
          )
      ) {
        commonProductForOrders[indx].price += `,${(
          this.OrderObj["productPrices"][index] /
          this.OrderObj["productQuantities"][index]
        ).toString()}`;
        commonProductForOrders[indx].orderId += `,${this.OrderObj[
          "orderID"
        ].toString()}`;
      }
    });

    return commonProductForOrders.filter((x) => x.price.includes(","));
  }
}
