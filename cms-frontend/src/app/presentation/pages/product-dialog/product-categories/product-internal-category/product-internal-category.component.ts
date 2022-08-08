import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InternalCategoryModel } from '@core/domain/internal-category.model';
import { GetInternalCategoriesUseCase } from '@core/usecases/internal-categories/get-internal-categories.usecase';
import {
  GetInternalSubCategoryByIdUseCase,
} from '@core/usecases/internal-categories/get-internal-sub-category-by-id.usecase';
import { GetInternalSubCategoriesUseCase } from '@core/usecases/internal-categories/get-internal-subcategories.usecase';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'ngx-product-internal-category',
  templateUrl: './product-internal-category.component.html',
  styleUrls: ['./product-internal-category.component.scss'],
})
export class ProductInternalCategoryComponent implements OnInit {
  public levelOneCategoriesList: InternalCategoryModel[] = [];
  public levelTwoCategoriesList: InternalCategoryModel[] = [];
  public levelThreeCategoriesList: InternalCategoryModel[] = [];
  public isLoading = false;
  constructor(
    public productsService: ProductsService,
    private getInternalCategoriesUseCase: GetInternalCategoriesUseCase,
    private getInternalSubCategoriesUseCase: GetInternalSubCategoriesUseCase,
    private getInternalSubCategoryByIdUseCase: GetInternalSubCategoryByIdUseCase,
    private toast: ToastService,
  ) { }
  ngOnInit(): void {
    this.getFirstLevelInternalCategories();
  }
  getFirstLevelInternalCategories(): void {
    this.isLoading = true;
    this.getInternalCategoriesUseCase.execute().subscribe(levelOneCategoriesList => {
      this.levelOneCategoriesList = levelOneCategoriesList;
      this.getPreselectedInternalCategories();
    });
  }
  getPreselectedInternalCategories(): void {
    if (this.productsService.editedVariantGroup?.internalCategoryId) {
      this.getInternalSubCategoryByIdUseCase.execute(
        this.productsService.editedVariantGroup.internalCategoryId,
      ).subscribe(productInternalCategory => {
        this.productsService.productForm.get('productCategoryForm').get('internalCategoryForm').patchValue({
          levelOneCategoryId: productInternalCategory.ancestors[0]?.categoryId,
          levelTwoCategoryId: productInternalCategory.ancestors[1]?.categoryId,
          levelThreeCategoryId: productInternalCategory.id,
        });
        this.getInternalCategoryLevels();
      }, (err: {error: {description: string; message: string}}) => {
        this.toast.showToast('Error', err.error.description);
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }
  getInternalCategoryLevels() {
    forkJoin({
      levelTwoCategoriesList:
        this.getInternalSubCategoriesUseCase.execute(this.productsService.productForm.get('productCategoryForm')
          .get('internalCategoryForm').get('levelOneCategoryId').value),
      levelThreeCategoriesList:
        this.getInternalSubCategoriesUseCase.execute(this.productsService.productForm.get('productCategoryForm')
          .get('internalCategoryForm').get('levelTwoCategoryId').value),
    }).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(({ levelTwoCategoriesList, levelThreeCategoriesList }) => {
      this.levelTwoCategoriesList = levelTwoCategoriesList;
      this.levelThreeCategoriesList = levelThreeCategoriesList;
    });
  }
  onCategorySelectionChange(categoryId, selectedLevel) {
    const internalCategoryForm = this.productsService.productForm.get('productCategoryForm')
      .get('internalCategoryForm') as FormGroup;
    internalCategoryForm.patchValue({
      ...internalCategoryForm.value,
      levelTwoCategoryId: selectedLevel === 1 ? undefined : internalCategoryForm.controls['levelTwoCategoryId'].value,
      levelThreeCategoryId: undefined,
    });
    this.getInternalSubCategoriesUseCase.execute(categoryId).subscribe((categories) => {
      if (selectedLevel === 1) {
        this.levelTwoCategoriesList = categories;
        this.levelThreeCategoriesList = [];
      } else if (selectedLevel === 2) {
        this.levelThreeCategoriesList = categories;
      }
    });
  }
}
