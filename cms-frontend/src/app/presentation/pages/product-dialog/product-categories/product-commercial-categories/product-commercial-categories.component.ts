import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import { CategoryModel } from '@core/domain/variant-group.model';
import { GetCommercialCategoriesUseCase } from '@core/usecases/commercial-categories/get-commercial-categories.usecase';
import { GetCategoriesUseCase } from '@core/usecases/variant-groups/get-categories.usecase';
import { CMS_ADD_EDIT_PRODUCT_COMMERCIAL_CATEGORIES } from '@presentation/@core/contstants/feature-flags';
import { RemoteConfigService } from '@presentation/@core/utils';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { finalize, take } from 'rxjs/operators';
@Component({
  selector: 'ngx-product-commercial-categories',
  templateUrl: './product-commercial-categories.component.html',
  styleUrls: ['./product-commercial-categories.component.scss'],
})
export class ProductCommercialCategoriesComponent implements OnInit {
  levelOneCategoriesList: CommercialCategoryModel[] = [];
  cardsFormGroupList: FormArray;
  isLoadingLevelOneCategoriesList = false;
  categoriesList: CategoryModel[] = [];
  addEditProductCommercialCategoryFlag = false;
  constructor(
    private toast: ToastService,
    public productsService: ProductsService,
    private getCommercialCategoriesUseCase: GetCommercialCategoriesUseCase,
    private getCategoriesUseCase: GetCategoriesUseCase,
    private remoteConfigService: RemoteConfigService,
  ) { }
  ngOnInit(): void {
    this.remoteConfigService.getFeatureFlags(CMS_ADD_EDIT_PRODUCT_COMMERCIAL_CATEGORIES)
      .pipe(take(1))
      .subscribe(flag => {
        this.addEditProductCommercialCategoryFlag = flag;
      });
    this.cardsFormGroupList =
      this.productsService.productForm.get('productCategoryForm.commercialCategoryForm') as FormArray;
    this.isLoadingLevelOneCategoriesList = true;
    this.getCommercialCategoriesUseCase
      .execute(this.productsService.selectedCountryCode)
      .pipe(finalize(() => this.isLoadingLevelOneCategoriesList = false))
      .subscribe((categories) => {
        this.levelOneCategoriesList = categories;
      }, (err: HttpErrorResponse) => {
        const errorMessage = err.error.description ?? 'An error occurred while fetching commercial categories!';
        this.toast.showToast('Error', errorMessage);
      });
    this.getCategoriesUseCase.execute({
      filter: {
        country: this.productsService.selectedCountryCode,
      },
    }).subscribe((categories) => {
      this.categoriesList = categories;
    });
  }
  onDeleteCard(deletedIndex: number): void {
    this.productsService.deleteFromCommercialCategoryForm(deletedIndex);
  }
  onAddNewCard(): void {
    this.productsService.addToCommercialCategoryForm();
  }
  setCategoryName(categoryId) {
    if (categoryId) {
      const category = this.categoriesList.filter(item => item._id === categoryId)[0];
      this.productsService.productForm.get('productCategoryForm').get('categoryName').setValue(
        category ? category.name.arName : '',
      );
    }
  }
}
