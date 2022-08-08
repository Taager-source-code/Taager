import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ProductService } from "../../services/product.service";
import { OrderService } from "../../services/order.service";
import { ResponsiveService } from "../../services/responsive.service";
import * as moment from "moment";
@Component({
  selector: "app-item-carousel",
  templateUrl: "./item-carousel.component.html",
  styleUrls: ["./item-carousel.component.scss"],
})
export class ItemCarouselComponent implements OnInit {
  private allBestsellers = [];
  public showBestsellers = [];
  public topCategories: string[];
  public itemsPerSlide: number;
  public activeTag = "";
  public changeCat = true;
  public loading = true;
  constructor(
    private router: Router,
    private productService: ProductService,
    public responsiveService: ResponsiveService
  ) {}
  ngOnInit(): void {
    this.productService.getCategories().subscribe((res) => {
      const categories = res.data;
      this.productService
        .getBestsellers()
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => {
          this.allBestsellers = res.data.map((item) => ({
            Category: categories.find((x) => x._id == item.categoryId).text,
            products: item.products,
          }));
          this.showBestsellers = this.allBestsellers[0].products;
          const categoryNames = this.allBestsellers.map(
            (item) => item.Category
          );
          this.topCategories = Array.from(new Set(categoryNames));
        });
      this.responsiveService.getMobileStatus().subscribe((isMobile) => {
        this.itemsPerSlide = isMobile ? 1 : 3;
      });
    });
  }
  filterBestsellers(name: string): void {
    if (this.activeTag === name) {
      this.activeTag = "";
      this.showBestsellers = this.allBestsellers[0].products;
      this.changeCat = false;
      setTimeout(() => (this.changeCat = true), 0);
      return;
    }
    this.showBestsellers = this.allBestsellers.filter((item) => {
      this.activeTag = name;
      return item.Category === name;
    })[0]["products"];
    this.changeCat = false;
    setTimeout(() => (this.changeCat = true), 0);
  }
  navigateToProductDetails(id, name, product): void {
    this.router.navigate(["/product", id], { queryParams: { name } });
  }
}
