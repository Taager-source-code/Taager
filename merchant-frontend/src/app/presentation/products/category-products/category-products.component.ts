/* eslint-disable @typescript-eslint/naming-convention */

import { Component, isDevMode, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { CategoryInterface } from 'src/app/presentation/shared/interfaces/product.interafce';
import { CatalogService } from 'src/app/presentation/shared/services/catalog.service';
import { VariantGroup } from 'src/app/presentation/shared/interfaces/variant';
import {
  ALL_PRODUCTS_CATEGORY, FEATURE_FLAGS, PAGES_FILTER_SIZE, TAAGER_EXCLUSIVE_OFFFERS_CATEGORY
} from 'src/app/presentation/shared/constants';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { User } from 'src/app/presentation/shared/interfaces/user.interface';
import { CategoryProductsUserActions } from 'src/app/presentation/shared/interfaces/category-products-actions';
import {
  CATEGORY_PRODUCTS_USER_ACTIONS, CATEGORY_PRODUCTS_SORTING_OPTIONS, SORT_BY_ORDER_COUNT, SORT_BY_CREATED_AT
} from 'src/app/presentation/shared/constants/category-products';
import { IconsService } from 'src/app/presentation/shared/services/icons.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { finalize, take } from 'rxjs/operators';
import { CommercialCategoriesService } from '../../shared/services/commercial-categories.service';
import { COMMERCIAL_CATEGORY_TREE_ROOT } from '../../shared/constants/commercial-categories';
import { CommercialCategoryTreeNode } from '../../shared/interfaces/commercial-categories.interface';
import { CategoriesSidebarComponent } from './categories-sidebar/categories-sidebar.component';
import { CategoryService } from '../../shared/services/category.service';
import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';
import { Subscription } from 'rxjs';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.scss'],
  providers: [CommercialCategoriesService]
})

export class CategoryProductsComponent implements OnInit, OnDestroy {
  @ViewChild('categoriesSidebar') categoriesSidebar: CategoriesSidebarComponent;
  public variantGroups: VariantGroup[] = [];
  public products: any[] = [];
  public currentPage: number;
  public noOfItems: number;
  public maxItemPerPage: number;
  public sortedBy: { value: string; text: string };
  public page: 1;
  public maxPageSize = 6;
  public levelOneCategoriesNodes: CommercialCategoryTreeNode[];
  public isCategoriesLoaded = false;
  public selectedCategoryName: string;
  public firstLevelCategoryName: string;
  public defaultCategory = ALL_PRODUCTS_CATEGORY;
  public featureGroupId: number;
  public featureGroupTitle: string;
  public defaultKey;
  public defaultCurrentPage = 1;
  public searchKey;
  public loading: boolean;
  public pageTitle: string;
  public showPagination: boolean;
  public isCollapsed = true;
  public isProductsAvailable: boolean;
  public miniProductsOne = [];
  public miniProductsTwo = [];
  public user: User;
  public isCatalogDataLoaded = false;
  public currentUserAction: CategoryProductsUserActions;
  public filteredCategories: CategoryInterface[];
  public userActions: { [key: string]: CategoryProductsUserActions } = CATEGORY_PRODUCTS_USER_ACTIONS;
  public sortingOptions = CATEGORY_PRODUCTS_SORTING_OPTIONS;
  public queryParamsObject;
  public selectedCategoryId = '';
  public categories: CategoryInterface[];
  public selectedCategory: string;
  public pagesFilterSize = PAGES_FILTER_SIZE;
  public isMobile: boolean;
  public iconsBaseUrl;

  public fourthLevelCategoriesList;
  public categoryHierachy: CommercialCategoryTreeNode[];
  public categoryHierachyHasFourlevels = false;
  public categoryHierarchyHasLessThanTwoLevels = false;
  public commercialCategoriesFeatureFlag = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private mixpanelService: MixpanelService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private iconsService: IconsService,
    private catalogService: CatalogService,
    private commercialCategoriesService: CommercialCategoriesService,
    private getFeatureFlagUseCase: GetFeatureFlagUsecase,
    private categoryService: CategoryService,
    private responsiveService: ResponsiveService
  ) {
    this.getMobileStatus();
  }

  ngOnInit(): void {
    if (!isDevMode()) {
      this.getFeatureFlagUseCase.execute(FEATURE_FLAGS.COMMERCIAL_CATEGORIES_FLAG).subscribe((flag) => {
        this.commercialCategoriesFeatureFlag = flag;
        if(flag){
          this.getSelectedCommercialCategories();
        } else {
          this.getNonCommercialCategories();
        }
      });
    } else {
      this.commercialCategoriesFeatureFlag = true;
      this.getSelectedCommercialCategories();
    }
    this.getProfileData();
    this.getCatalogedProducts();
    this.iconsBaseUrl = environment.IMAGES_BUCKET_URL;
  }

  getMobileStatus() {
    this.responsiveService.getMobileStatus().subscribe(
      (res) => {
        this.isMobile = res;
      }
    );
  }
  getSelectedCommercialCategories(): void {
    this.subscriptions.push(
      this.route.params.pipe().subscribe(params => {
        this.commercialCategoriesService.getCommercialCategoriesTree().pipe(take(1)).subscribe(tree => {
          if (tree) {
            if (params.id) {
              this.selectedCategoryId = params.id;
              const categoryHierarchy = this.commercialCategoriesService.getCategoryHierarchy(tree, params.id);
              if (categoryHierarchy.length) {
                this.categoryHierachy = categoryHierarchy;
                this.categoryHierachyHasFourlevels = categoryHierarchy.length > 3
                  && categoryHierarchy[categoryHierarchy.length - 4].hasChildren;
                this.categoryHierarchyHasLessThanTwoLevels = false;
                if (categoryHierarchy.length < 3 && !categoryHierarchy[0].hasChildren) {
                  this.categoryHierarchyHasLessThanTwoLevels = true;
                  this.firstLevelCategoryName = COMMERCIAL_CATEGORY_TREE_ROOT.name.arabicName;
                  this.pageTitle = this.firstLevelCategoryName;
                  this.levelOneCategoriesNodes = tree.root.children;
                  this.setCategoriesIcons();
                  this.getQueryParams();
                }
                if (this.categoryHierachyHasFourlevels) {
                  this.fourthLevelCategoriesList = categoryHierarchy[categoryHierarchy.length - 4].children;
                  this.categoryHierarchyHasLessThanTwoLevels = false;
                }
                if (this.isMobile) {
                  this.levelOneCategoriesNodes = tree.root.children;
                }
                this.selectedCategoryName = categoryHierarchy[0].value.name.arabicName;
                this.categoriesSidebar?.getSelectedCategoryNodes(categoryHierarchy);
                this.isCategoriesLoaded = true;
                this.pageTitle = categoryHierarchy[categoryHierarchy.length - 2].value.name.arabicName;
                this.getQueryParams();
              } else {
                this.router.navigateByUrl('products/invalid-category');
              }
            } else {
              this.selectedCategoryName = COMMERCIAL_CATEGORY_TREE_ROOT.name.arabicName;
              this.categoryHierarchyHasLessThanTwoLevels = true;
              this.pageTitle = this.selectedCategoryName;
              this.levelOneCategoriesNodes = tree.root.children;
              this.setCategoriesIcons();
              this.getQueryParams();
            }
          }
        });
      }));

  }

  getNonCommercialCategories() {
    this.categoryService.getCategories().pipe(take(1)).subscribe(res => {
      this.categories = res.data;
      this.filteredCategories = this.categories.filter(
        category => category.text !== ALL_PRODUCTS_CATEGORY && category.text !== TAAGER_EXCLUSIVE_OFFFERS_CATEGORY
      );
      this.getQueryParams();
      this.setCategoriesIcons();
    });
  }

  getQueryParams(): void {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params: Params) => {
        this.getSortingAndPaginationQueryParams(params);
        this.setupQueryParamsObject();
        this.selectedCategory = params.category || this.defaultCategory;
        this.pageTitle = this.selectedCategory;
        if (params.featureGroupId) {
          this.currentUserAction = CategoryProductsUserActions.navigate_to_featured_group;
          this.getFeatureProductsQueryParams(params);
          this.getFeaturedProductsGroup();
        } else {
          if (params.q) {
            this.currentUserAction = CategoryProductsUserActions.product_search;
          } else {
            this.currentUserAction = CategoryProductsUserActions.navigate_to_category;
          }
          this.getProductsForCategory();
        }
        this.getMiniProducts();
      }));
  }

  getFeatureProductsQueryParams(params): void {
    this.pageTitle = params.featureGroupTitle;
    this.featureGroupId = params.featureGroupId;
    this.featureGroupTitle = params.featureGroupTitle;
  }

  getSortingAndPaginationQueryParams(params): void {
    this.searchKey = params.q || this.defaultKey;
    this.currentPage = +params.currentPage || this.defaultCurrentPage;
    this.maxItemPerPage = +params.items || 12;
    this.detectSorting(params);
  }

  getProfileData() {
    this.user = this.localStorageService.getUser();
  }
  // TODO: Add flag check, related to mobiles icon
  setCategoriesIcons(): void {
    const categoryEnglishNames = this.levelOneCategoriesNodes.map(categoryNode => ({ name: categoryNode.value.name.englishName }));
    this.iconsService.initializeCategoryIcons(categoryEnglishNames).then(() => {
      this.isCategoriesLoaded = true;
    }, () => {
      this.isCategoriesLoaded = true;
    });
  }

  getProductsForCategory(): void {
    this.loading = true;
    this.products = [];
    this.variantGroups = [];
    const query: { [attribute: string]: any } = {
      pageSize: this.maxItemPerPage,
      page: this.currentPage,
      query: this.searchKey,
      sortBy: this.sortedBy.value,
    };
    if (this.selectedCategoryId) {
      query.commercialCategoryId = this.selectedCategoryId;
    }
    this.productService.getProductsForCategory(query).pipe(finalize(() => {
      this.loading = false;
    })).subscribe((res: any) => {
      this.variantGroups = res.results;
      this.noOfItems = res.count;
      this.isProductsAvailable = this.noOfItems >= 1;
      this.mixpanelService.track('Go_to_category', {
        'Category Name': this.selectedCategoryName,
        'Is Products Available': this.isProductsAvailable,
      });
      this.showPagination = this.noOfItems > this.maxItemPerPage;
      window.scrollTo(0, 0);
      if (this.currentUserAction === CategoryProductsUserActions.product_search && this.variantGroups.length === 0) {
        this.router.navigate(['products', 'no-search-results'], { queryParams: { searchKey: this.searchKey } });
      }
    });
  }

  getFeaturedProductsGroup(): void {
    this.loading = true;
    this.variantGroups = [];
    this.products = [];
    this.productService.getFeaturedProductsGroup(this.featureGroupId).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(res => {
      this.products = res.data.products;
      this.noOfItems = this.products?.length;
      this.isProductsAvailable = this.noOfItems >= 1;
      this.pageTitle = this.featureGroupTitle;
      window.scrollTo(0, 0);
    });
  }

  getMiniProducts(): void {

    const bestSellersQuery = {
      pageSize: 3,
      page: 1,
      sortBy: SORT_BY_ORDER_COUNT,
      category: ALL_PRODUCTS_CATEGORY,
      countable: false
    };
    this.miniProductsOne = [];
    this.productService.getProductsForCategory(bestSellersQuery).subscribe((res: any) => {
      this.miniProductsOne = res.results.map(variantGroup => variantGroup.primaryVariant);
    });

    const newProductsQuery = {
      pageSize: 3,
      page: 1,
      sortBy: SORT_BY_CREATED_AT,
      category: ALL_PRODUCTS_CATEGORY,
      countable: false
    };
    this.miniProductsTwo = [];
    this.productService.getProductsForCategory(newProductsQuery).subscribe((res: any) => {
      this.miniProductsTwo = res.results.map(variantGroup => variantGroup.primaryVariant);
    });
  }

  pageChanged(event): void {
    this.currentPage = event.page;
    this.deepLinkSearch();
  }


  deepLinkSearch(): void {
    const queryString: { [attribute: string]: any } = {
      q: this.searchKey,
      currentPage: this.currentPage,
      items: this.maxItemPerPage,
      sorting: this.sortedBy.value,
    };
    if (this.commercialCategoriesFeatureFlag) {
      this.router.navigate(['products', 'category', this.selectedCategoryId], { queryParams: queryString });
    } else {
      queryString.category = this.selectedCategoryName;
      this.router.navigate(['products', 'category'], { queryParams: queryString });
    }
  }

  changeItemsOnPage(num: number) {
    this.maxItemPerPage = num;
    this.currentPage = 1;
    this.deepLinkSearch();
  }

  changeSorting(sortBy: string) {
    this.sortingOptions.forEach(sortingOption => {
      if (sortBy === sortingOption.value) {
        this.sortedBy = { ...sortingOption };
      }
    });
    this.deepLinkSearch();
  }


  detectSorting(params) {
    this.sortedBy = this.sortingOptions[0];

    this.sortingOptions.forEach(sortingOption => {
      if (sortingOption.value === params.sorting) {
        this.sortedBy = sortingOption;
      }
    });
  }

  getCatalogedProducts(): void {
    this.catalogService.getCatalogedProducts().pipe(finalize(() => {
      this.isCatalogDataLoaded = true;
    })).subscribe(() => { });
  }


  setupQueryParamsObject(): void {
    this.queryParamsObject = {
      items: this.maxItemPerPage,
      sorting: this.sortedBy.value,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => subscription.unsubscribe());
  }

}


