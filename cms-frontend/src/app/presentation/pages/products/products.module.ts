import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import {
  VariantGroupFilterModel,
  VariantGroupModel,
  VariantModel,
} from '@core/domain/variant-group.model';
import { GetCommercialCategoriesUseCase } from '@core/usecases/commercial-categories/get-commercial-categories.usecase';
import { GetProductsUseCase } from '@core/usecases/variant-groups/get-products.usecase';
import { AVAILABILITY_STATUSES, DEFAULT_SEARCH_FILTERS } from '@data/constants';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'ngx-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('ejsGrid') ejsGrid: GridComponent;
  variantGroups: VariantGroupModel[];
  tableSettings: { count: number; result: VariantModel[] };
  paginationSettings: PageSettingsModel;
  filterFormGroup: FormGroup;
  productsFilterObject: VariantGroupFilterModel = DEFAULT_SEARCH_FILTERS;
  availabilityStatuses = AVAILABILITY_STATUSES;
  categoriesList: CommercialCategoryModel[] = [];
  totalNumberOfItems = 0;
  loading = false;
  constructor(
    private productsService: ProductsService,
    private getProductsUseCase: GetProductsUseCase,
    private getCommercialCategoriesUseCase: GetCommercialCategoriesUseCase,
    private _formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.initializeFilterForm();
    this.productsService.selectedCountryCodeSubject.subscribe((countryCode) => {
      if(countryCode) {
        this.setCategoriesList(countryCode);
        this.productsFilterObject = DEFAULT_SEARCH_FILTERS;
        this.productsFilterObject.filter.country = countryCode;
        this.filterFormGroup.reset();
        this.getProducts();
      }
    });
    this.paginationSettings = {
      pageSize: 25,
      pageCount: 6,
    };
  }
  setCategoriesList(countryCode) {
    this.getCommercialCategoriesUseCase.execute(countryCode)
      .subscribe((categories) => {
      this.categoriesList = categories;
    });
  }
  initializeFilterForm() {
    this.filterFormGroup = this._formBuilder.group({
      prodID: '',
      productAvailability: null,
      commercialCategoryId: '',
    });
  }
  getProducts() {
    this.loading = true;
    this.tableSettings = {
      count: 0,
      result: [],
    };
    this.getProductsUseCase.execute(this.productsFilterObject).pipe(finalize(() => {
      this.loading = false;
    })).subscribe(response => {
      this.variantGroups = response.variantGroups;
      this.totalNumberOfItems = response.allProductsCount;
      this.tableSettings = {
        count: response.allProductsCount,
        result: this.variantGroups.map(variantGroup => variantGroup.primaryVariant),
      };
    });
  }
  openEditProduct(primaryVariantId): void {
    const clickedVariantGroupId = this.variantGroups.filter(
      variantGroup => variantGroup.primaryVariant._id === primaryVariantId)[0]._id;
    this.productsService.setEditedVariantGroupId(clickedVariantGroupId);
  }
  pageChange(event) {
    if (event.currentPage) {
      this.productsFilterObject.page = event.currentPage;
      this.getProducts();
    }
  }
  submitProductFilters() {
    const filters = this.filterFormGroup.value;
    const validFilters = Object.keys(filters)
      .filter((key) => filters[key])
      .reduce((resultObject, key) => {
        resultObject[key] = filters[key];
        return resultObject;
      }, {});
    // if the filters exists, get the products
    if (Object.keys(validFilters).length) {
      this.productsFilterObject = {
        ...this.productsFilterObject,
        filter: {
          ...this.productsFilterObject.filter,
          ...validFilters,
        },
      };
      this.getProducts();
    }
  }
  clearSearch() {
    this.productsFilterObject = DEFAULT_SEARCH_FILTERS;
    this.filterFormGroup.reset();
    this.getProducts();
  }
}
