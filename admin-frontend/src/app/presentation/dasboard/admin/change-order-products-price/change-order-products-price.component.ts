import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { FormGroup, FormBuilder, FormArray, FormControl } from "@angular/forms";
import { COLOR_VARIANTS } from "../../../shared/constants/variants";
import { SharedService } from "../../../shared/services/shared.service";

interface OrderUpdateReq {
  _id: string;
  orderId: string;
  //orders: [];
  cashOnDelivery: number;
  productPrices: any[];
  profit: number;
  productProfits: any[];
  orderStatus: string;
  order: any;
  oldProfit: number;
  orderedBy: any;
}
@Component({
  selector: "app-change-order-products-price",
  templateUrl: "./change-order-products-price.component.html",
  styleUrls: ["./change-order-products-price.component.scss"],
})
export class ChangeOrderProductsPriceComponent implements OnInit {
  public changeOrderProductsPriceForm: FormGroup;
  public reqObj = {} as OrderUpdateReq;
  public productList: FormArray;
  COD = 0;
  // currentProductPrices: any[] = [];
  productQuantities: any[] = [];
  productPrices: any[] = [];
  productProfits: any[] = [];
  productProfitsPerQty: any[] = [];
  products: any[] = [];
  profit = 0;

  order: any;
  provinceShipping = 0;

  priceValid = true;
  priceValidForProfit = true;
  clicked = false;
  calculatedProfit = false;

  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private productService: ProductService,
    private dilogRef: MatDialogRef<ChangeOrderProductsPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.changeOrderProductsPriceForm = new FormGroup({
      cashOnDelivery: new FormControl({ value: 0, disabled: true }),
      profit: new FormControl({ value: 0, disabled: true }),
      province: new FormControl({ value: 0, disabled: true }),
      productList: this.formBuilder.array([]),
    });

    this.productQuantities = [...this.data.productQuantities];
    this.productPrices = [...this.data.productPrices];
    this.profit = this.data.profit;
    this.order = this.data.order;

    this.COD = this.data.cashOnDelivery; //&& this.data.cashOnDelivery!=0? this.data.cashOnDelivery : this.calculateInitialCOD();

    this.productService.getProductsByIds(this.data.products).subscribe(
      (res: any) => {
        this.products = res.data;

        if (this.data.productProfits && this.data.productProfits.length > 0)
          this.productProfits = [...this.data.productProfits];
        else this.calculateProfits();

        this.setProductsPriceList(this.products);
      },
      (err) => {}
    );
    this.orderService.getProvinces(this.order.country).subscribe((res: any) => {
      this.provinceShipping = res.data.find(
        (x) => x.location == this.data.province
      ).shippingRevenue;

      this.changeOrderProductsPriceForm.patchValue({
        cashOnDelivery: this.data.cashOnDelivery, //&& this.data.cashOnDelivery!=0? this.data.cashOnDelivery : this.calculateInitialCOD(),
        profit: this.data.profit,
        province: this.provinceShipping,
      });
    });
  }

  ngOnInit() {}

  calculateProfits() {
    this.data.productProfits = [];
    this.products.forEach((element, index) => {
      //get new total price (per product)
      const productOrderPrice =
        this.productPrices[index] / this.productQuantities[index];

      //calculate product profit on order
      const productActualProfit = this.products[index].productProfit;
      const productActualPrice = this.products[index].productPrice;
      const productorderProfit =
        productOrderPrice - productActualPrice + productActualProfit;
      this.data.productProfits.push(productorderProfit);
    });
  }

  updateProductsPrice() {
    this.clicked = true;

    if (this.priceValid) {
      if (this.priceValidForProfit) {
        if (
          this.changeOrderProductsPriceForm.valid &&
          this.changeOrderProductsPriceForm.value
        ) {
          this.reqObj._id = this.data._id;
          this.reqObj.orderId = this.data.orderId;
          this.reqObj.orderStatus = this.data.orderStatus;
          this.reqObj.cashOnDelivery = this.COD ? this.COD : undefined;
          this.reqObj.productPrices =
            this.productPrices && this.productPrices.length > 0
              ? this.productPrices
              : undefined;
          this.reqObj.productProfits =
            this.productProfits && this.productProfits.length > 0
              ? this.productProfits
              : undefined;
          this.reqObj.profit = this.profit;
          this.reqObj.oldProfit = this.order.orderProfit;
          this.reqObj.orderedBy = this.order.orderedBy;

          this.orderService.updateOrderProductPrices(this.reqObj).subscribe(
            (res: any) => {
              this.dilogRef.close();
              this.toastr.success(res.msg);
            },
            (err) => {}
          );
        }
      } else {
        this.clicked = false;
        this.toastr.error("Product price entered will give negtive profit");
      }
    } else {
      this.clicked = false;
      this.toastr.error("Please enter price for all products");
    }
  }

  createProduct(
    name = "",
    qty = 0,
    priceForOne = 0,
    priceForQty = 0,
    profitForOne = 0,
    profitForQty = 0
  ) {
    return this.formBuilder.group({
      name,
      qty,
      priceForOne,
      priceForQty,
      profitForOne,
      profitForQty,
    });
  }

  onPriceChange(e): void {
    let index = e.target.getAttribute("data-index");

    //get new qty
    const newPrice = e.target.value;

    if (newPrice && newPrice != "" && newPrice >= 0) {
      this.priceValid = true;

      //get previous total price (per product) and qty
      const totalPrice = this.data.productPrices[index];
      const qty = this.data.productQuantities[index];
      const oldPrice = totalPrice / qty;

      //get new total price (per product)
      // const productOrderPrice = this.data.productPrices[index] / this.data.productQuantities[index];
      const newTotalPrice = newPrice * qty;

      //calculate product profit on order
      const productorderProfit = this.data.productProfits[index];
      let productorderNewProfit = productorderProfit + (newPrice - oldPrice);

      if (productorderNewProfit >= 0) {
        this.priceValidForProfit = true;

        this.productPrices[index] = newTotalPrice;
        this.productProfits[index] = productorderNewProfit;

        this.productList = this.changeOrderProductsPriceForm.get(
          "productList"
        ) as FormArray;

        this.productList.controls[index]["controls"]["priceForQty"].patchValue(
          newTotalPrice
        );
        this.productList.controls[index]["controls"]["profitForOne"].patchValue(
          productorderNewProfit
        );
        this.productList.controls[index]["controls"]["profitForQty"].patchValue(
          productorderNewProfit * qty
        );

        this.profit = 0;
        this.COD = this.provinceShipping;

        for (let i = 0; i < this.productList.controls.length; i++) {
          const element = this.productList.controls[i];

          let priceForQty = element["controls"]["priceForQty"].value;
          let profitForQty = element["controls"]["profitForQty"].value;

          this.profit += profitForQty;
          this.COD += priceForQty;
        }

        this.changeOrderProductsPriceForm.patchValue({
          cashOnDelivery: this.COD,
          profit: this.profit,
        });
      } else {
        this.priceValidForProfit = false;
      }
    } else {
      this.priceValid = false;
    }
  }

  setProductsPriceList(products) {
    this.productList = this.changeOrderProductsPriceForm.get(
      "productList"
    ) as FormArray;
    products.forEach((item, index) => {
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
      this.productList.push(
        this.createProduct(
          `${this.data.productIds[index]} - ${item.productName}${
            productColorName ? "- " + productColorName : ""
          }${productSize ? "- " + productSize : ""}`,
          this.data.productQuantities[index],
          this.data.productPrices[index] / this.data.productQuantities[index],
          this.data.productPrices[index],
          this.data.productProfits[index],
          this.data.productProfits[index] * this.data.productQuantities[index]
        )
      );
    });
  }
}
