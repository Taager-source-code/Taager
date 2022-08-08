import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { CarouselInterface } from 'src/app/presentation/shared/interfaces/product.interafce';
import { VariantGroup } from 'src/app/presentation/shared/interfaces/variant';
import { CommercialCategoriesService } from 'src/app/presentation/shared/services/commercial-categories.service';
import { FEATURE_FLAGS } from 'src/app/presentation/shared/constants';
import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss'],
  providers: [CommercialCategoriesService]
})
export class ProductsCarouselComponent implements OnInit {
  @Input() carouselData: CarouselInterface;
  @Input() isCatalogDataLoaded = false;
  public variantGroups: VariantGroup[];
  public categoryName: string;
  public categoryId: string;
  public sorting: string;
  public title: string;
  public randomize: boolean;
  public featuredGroupId: number;
  public tooltipVisible: boolean;
  public itemsPerSlide: number;
  public showNavigationArrows: boolean;
  public loading = true;
  public products: any[] = [];
  public arrowsOutside: boolean;
  public pageNumber = 1;
  public commercialCategoriesFlag = false;

  constructor(
    public responsiveService: ResponsiveService,
    public productService: ProductService,
    private router: Router,
    private commercialCategoriesService: CommercialCategoriesService,
    private getFeatureFlagUseCase: GetFeatureFlagUsecase,

  ) {
    this.products = [];
  }

  ngOnInit(): void {
    if (!isDevMode()) {
      this.getFeatureFlagUseCase.execute(FEATURE_FLAGS.COMMERCIAL_CATEGORIES_FLAG).subscribe((flag) => {
        this.commercialCategoriesFlag = flag;
        this.setupInputs();
      });
    } else {
      this.commercialCategoriesFlag = true;
      this.setupInputs();
    }

    const screenSize = this.responsiveService.getScreenWidth();
    if (screenSize === 'xl') {
      this.itemsPerSlide = 4;
      this.showNavigationArrows = true;
      this.tooltipVisible = true;
      this.arrowsOutside = true;
    } else if (screenSize === 'lg') {
      this.itemsPerSlide = 3;
      this.tooltipVisible = true;
      this.showNavigationArrows = true;
      this.arrowsOutside = true;
    } else if (screenSize === 'md') {
      this.itemsPerSlide = 3;
      this.tooltipVisible = true;
      this.showNavigationArrows = false;
    } else if (screenSize === 'sm') {
      this.itemsPerSlide = 2;
      this.tooltipVisible = false;
      this.showNavigationArrows = false;
    } else {
      this.itemsPerSlide = 4;
      this.showNavigationArrows = true;
      this.tooltipVisible = true;
      this.arrowsOutside = true;
    }
  }

  setupInputs(): void {
    const { categoryName, sorting, title, randomize, featuredGroupId, categoryId } = this.carouselData;
    if (this.commercialCategoriesFlag) {
      if (categoryId) {
        this.categoryId = categoryId;
        this.sorting = sorting;
        this.title = title;
        this.randomize = randomize;
        this.featuredGroupId = featuredGroupId;
        this.getProducts();
      } else {
        let key = '';
        this.commercialCategoriesService.getCommercialCategoriesTree().pipe(take(1)).subscribe(
          tree => {
            key = tree.root.children.filter(
              category => category.value.name.arabicName === categoryName
            )[0]?.key;
            this.categoryId = key;
            this.sorting = sorting;
            this.title = title;
            this.randomize = randomize;
            this.featuredGroupId = featuredGroupId;
            this.getProducts();
          });
      }
    } else {
      this.categoryName = categoryName;
      this.sorting = sorting;
      this.title = title;
      this.randomize = randomize;
      this.featuredGroupId = featuredGroupId;
      this.getProducts();
    }
  }

  getProducts(): void {
    if (this.randomize) {
      this.pageNumber = Math.ceil(Math.random() * 8) + 1;
    }
    if (this.featuredGroupId) {
      this.getFeaturedGroupProducts();
    } else {
      this.getCategoryProducts();
    }
  }

  getCategoryProducts(): void {
    this.products = [];
    const query: { [attribute: string]: any } = {
      pageSize: 10,
      page: this.pageNumber,
      sortBy: this.sorting,
      countable: false
    };
    if (this.commercialCategoriesFlag) {
      query.commercialCategoryId = this.categoryId;
    } else {
      query.category = this.categoryName;
    }
    this.productService.getProductsForCategory(query).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res: any) => {
      this.variantGroups = res.results;
    }, () => {
      this.variantGroups = [];
    });
  }

  getFeaturedGroupProducts(): void {
    this.variantGroups = [];
    this.productService.getFeaturedProductsGroup(this.featuredGroupId).subscribe(res => {
      this.products = res.data.products;
      this.loading = false;
    }, () => {
      this.products = [];
    });
  }

  goToLink(): void {
    if (this.featuredGroupId) {
      this.goToFeaturedGroup();
    } else {
      this.goToCategory();
    }
  }

  goToCategory(): void {
    if (this.commercialCategoriesFlag) {
      const queryString = {
        currentPage: 1,
        items: 12,
        sorting: this.sorting,
      };
      const id = this.categoryId || '';
      this.router.navigate(['/', 'products', 'category', id], { queryParams: queryString });
    } else {
      const queryString = {
        q: '',
        category: this.categoryName,
        currentPage: 1,
        items: 12,
        sorting: this.sorting,
      };
      this.router.navigate(['/category-products'], { queryParams: queryString });
    }
  }

  goToFeaturedGroup(): void {
    const queryString = {
      q: '',
      featureGroupId: this.featuredGroupId,
      featureGroupTitle: this.title,
      currentPage: 1,
      items: 12,
      sorting: this.sorting,
    };
    this.router.navigate(['/category-products'], { queryParams: queryString });
  }
}


