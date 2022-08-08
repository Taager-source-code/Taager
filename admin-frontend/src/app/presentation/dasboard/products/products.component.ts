import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ProductService } from "../services/product.service";
import * as moment from "moment";
export interface Categories {
  name: string;
  text: string;
  _id: string;
  icon?: string;
}
@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  public products: any[] = [];
  public currentPage: number;
  public noOfItems: number;
  public maxItemPerPage: number = 12;
  public page: 1;
  public maxPageSize: number = 6;
  public categories: Categories[];
  public selectedCategory: string;
  public defaultCategory = "جميع المنتجات";
  public defaultKey = "";
  public defaultCurrentPage = 1;
  public searchKey = "";
  public loading = true;
  public title: string;
  public showPagination: boolean;
  public isCollapsed = true;
  public isProductsAvailable: boolean;
  private utmMedium: any;
  private utmSource: any;
  private utmCampaign: any;
  private utmContent: any;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedCategory = params.category || this.defaultCategory;
      this.searchKey = params.q || this.defaultKey;
      this.currentPage = +params.currentPage || this.defaultCurrentPage;
      this.maxItemPerPage = +params.items || 12;
      this.utmMedium = +params.utm_medium;
      this.utmSource = +params.utm_source;
      this.utmCampaign = +params.utm_campaign;
      this.utmContent = +params.utm_content;
      this.getCategories();
      this.search();
    });
  }
  getCategories(): void {
    this.productService.getCategories().subscribe((res) => {
      this.categories = res.data;
      this.getTitle(this.selectedCategory);
    });
  }
  getTitle(name: string): void {
    const selectedCat = this.categories.filter((item) => item.text === name);
    this.title = selectedCat[0].text;
  }
  search(): void {
    this.loading = true;
    this.productService
      .getProductsForCategory(
        this.maxItemPerPage,
        this.currentPage,
        this.searchKey,
        this.selectedCategory
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.products = res.data;
          this.noOfItems = res.count;
          if (this.noOfItems < 1) {
            this.isProductsAvailable = false;
          } else {
            this.isProductsAvailable = true;
          }
          this.showPagination = this.noOfItems > this.maxItemPerPage;
          window.scrollTo(0, 0);
        },
        () => {
          this.products = [];
        }
      );
  }
  pageChanged(event): void {
    this.currentPage = event.page;
    this.deepLinkSearch();
  }
  onCategoryChange(category: Categories): void {
    this.selectedCategory = category.text;
    this.searchKey = "";
    this.currentPage = 1;
    this.deepLinkSearch();
  }
  deepLinkSearch(): void {
    const queryString = {
      q: this.searchKey,
      category: this.selectedCategory,
      currentPage: this.currentPage,
      items: this.maxItemPerPage,
    };
    this.router.navigate(["/products"], { queryParams: queryString });
  }
  changeItemsOnPage(num: number) {
    this.maxItemPerPage = num;
    this.currentPage = 1;
    this.deepLinkSearch();
  }
  getIcon(name): string {
    return name
      ? `../../../assets/img/category-icons/${name}.svg`
      : "../../../assets/img/category-icons/all-items.svg";
  }
  getActiveIcon(name): string {
    return name
      ? `../../../assets/img/category-icons/active-${name}.svg`
      : "../../../assets/img/category-icons/active-all-items.svg";
  }
}
