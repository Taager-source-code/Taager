import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { ProfileService } from "../../services/profile.service";
import { finalize } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { CartService } from "../../services/cart.service";
import { datepickerAnimation } from "ngx-bootstrap/datepicker/datepicker-animations";
import * as moment from "moment";
import mapProductAvailiblityToArabic from "../../../shared/utilities/mapProductAvailiblityToArabic";
@Component({
  selector: "card-item",
  styleUrls: ["./card-item.component.scss"],
  templateUrl: "./card-item.component.html",
})
export class CardItemComponent {
  @Input()
  public product: any = {};
  public loading = false;
  public mapProductAvailiblity: Function = mapProductAvailiblityToArabic;
  public viewProduct = true;
  productAvailiblityStatus: string = "";
  inStock: boolean;
  public user: any;
  constructor(
    private profileService: ProfileService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    //var today = new Date();
    // var expiry = new Date(this.product.expiryDate.toString());
    // if (expiry >= today) this.viewProduct = true;
    this.setProductAvailiblity();
  }
  private getProfileData(): void {
    this.profileService.getProfile().subscribe(
      (res: any) => {
        this.user = res.data;
      },
      (err) => {}
    );
  }
  addToCart(): void {
    this.getProfileData();
    this.loading = true;
    this.cartService
      .getCartData()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((res1: any) => {
        if (res1.data.length >= 15) {
          this.toastr.success(
            "لا يوجد لديك مساحة في العربة. نرجو حذف بعض المنتجات ليمكنك الاضافة"
          );
        } else {
          this.cartService
            .addToCart(this.product._id, this.product.sellerName)
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe(
              (res: any) => {
                this.toastr.success("تم اضافة المنتج");
              },
              (err) => {
                this.toastr.success("موجود في العربة");
              }
            );
        }
      });
  }
  navigateToProductDetails(): void {
    this.router.navigate(["/product", this.product._id], {
      queryParams: { name: this.product.productName },
    });
  }
  setProductAvailiblity() {
    // if (this.product.showProductAvailability) {
    this.productAvailiblityStatus = this.product.productAvailability;
    // }
    // else {
    //    this.productAvailiblityStatus = this.product.productQuantityStatus;
    //  }
    this.inStock = this.productAvailiblityStatus != "not_available";
  }
  getColor() {
    if (this.productAvailiblityStatus.toString() == "available_with_high_qty")
      return "#008000";
    else if (this.productAvailiblityStatus.toString() == "available")
      return "#008000";
    else if (
      this.productAvailiblityStatus.toString() == "available_with_low_qty"
    )
      return "orange";
    else if (this.productAvailiblityStatus.toString() == "not_available")
      return "#FF0000";
    else {
      return "transparent";
    }
  }
}
