import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  OrderReplacementsDialogComponent,
  OrderRefundsDialogComponent,
  OrderCompletionDialogComponent,
} from "@taager-webapp/web-components";
import { ToastrService } from "ngx-toastr";
import { ORDER_ISSUE_TYPE } from "../../../shared/constants";
import { ProductInterface } from "../../../shared/constants/interfaces";
import { OrderIssuesService } from "../../services/order-issues.service";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-create-order-issues",
  templateUrl: "./create-order-issues.component.html",
  styleUrls: ["./create-order-issues.component.scss"],
})
export class CreateOrderIssuesComponent implements OnInit {
  @Input() order;
  @Output() orderIssueCreated = new EventEmitter<boolean>();

  dialogRef;
  componentInstance;

  products: ProductInterface[];
  orderIssueData;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private orderIssuesService: OrderIssuesService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {}

  onDialogClicked(issue) {
    switch (issue) {
      case ORDER_ISSUE_TYPE.REPLACEMENT.name:
        this.openClickedDialog(OrderReplacementsDialogComponent);
        break;
      case ORDER_ISSUE_TYPE.REFUND.name:
        this.openClickedDialog(OrderRefundsDialogComponent);
        break;
      case ORDER_ISSUE_TYPE.COMPLETION.name:
        this.openClickedDialog(OrderCompletionDialogComponent);
        break;
    }
  }

  openClickedDialog(dialogComponent): void {
    this.dialogRef = this.dialog.open(dialogComponent, {
      width: "650px",
      height: "550px",
      data: {
        order: this.order,
        isLoading: true,
        isProcessing: false,
        hideUploadButtons: true,
        products: [],
      },
      disableClose: false,
      autoFocus: false,
    });

    this.componentInstance = this.dialogRef.componentInstance;

    this.getOrderProducts();

    const submitOrderIssueSubscription =
      this.componentInstance.submitOrderIssue.subscribe((res) => {
        this.orderIssueData = res;
        this.handleFormSubmission();
      });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data == "confirmed") {
        this.orderIssueCreated.emit(true);
      }
      submitOrderIssueSubscription.unsubscribe();
    });
  }

  getOrderProducts(): void {
    this.productService.getProductsByIds(this.order.products).subscribe(
      (res) => {
        this.products = res.data;
        const order = this.componentInstance.data.order;
        this.products.forEach((product, index) => {
          if (order.products[index].toString() == product._id.toString()) {
            this.products[index].productQuantity =
              order.productQuantities[index];
            this.products[index].productProfit = order.productProfits[index];
          }
        });
        this.componentInstance.data.products = this.products;
        this.componentInstance.data.isLoading = false;
      },
      (err) => {
        this.toastr.error(err.msg);
        this.dialogRef.close();
      }
    );
  }

  handleFormSubmission(): void {
    if (this.checkFormValidity(this.orderIssueData)) {
      this.componentInstance.data.isProcessing = true;
      this.orderIssueData.product.productQty = this.orderIssueData.productQty;
      delete this.orderIssueData.productQty;
      this.placeOrderIssue();
    }
  }

  checkFormValidity(orderIssueData): boolean {
    if (!orderIssueData.product) {
      this.toastr.error("?????????? ????????????? ???????????????????????? ??????????????????");
      return false;
    } else if (this.componentInstance.data.isProcessing) {
      this.toastr.info("???????????????? ???????????? ???????????????????????");
      return false;
    } else if (orderIssueData.product.productQty < orderIssueData.productQty) {
      this.toastr.error("?????????????????????????? ??????????????????????????????????? ???????????????? ?????????? ????????????????? ??????????????????????");
      return false;
    }
    return true;
  }

  placeOrderIssue() {
    this.orderIssuesService.addChildOrder(this.orderIssueData).subscribe(
      () => {
        this.dialogRef.close({ data: "confirmed" });
        this.toastr.success("????????? ????????????????????? ?????????????????????? ?????????????????????");
      },
      (err) => {
        this.componentInstance.data.isProcessing = false;
        this.toastr.error("???????????????????? ???????????????????????????????????? ?????????????? ????????????????");
      }
    );
  }
}
