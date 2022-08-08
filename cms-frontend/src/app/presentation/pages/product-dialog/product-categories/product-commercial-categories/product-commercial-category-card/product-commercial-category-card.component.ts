import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommercialCategoryModel, CommercialSubCategoryModel } from '@core/domain/commercial-category.model';
import {
  GetCommercialSubCategoriesUseCase,
} from '@core/usecases/commercial-categories/get-commercial-sub-categories.usecase';
import {
  GetCommercialSubCategoryByIdUseCase,
} from '@core/usecases/commercial-categories/get-commercial-sub-category-by-id.usecase';
import {
  commercialCategoriesformControlNames,
  levelOneCommercialCategoryFormControlName,
} from '@presentation/@core/contstants/categories';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'ngx-product-commercial-category-card',
  templateUrl: './product-commercial-category-card.component.html',
  styleUrls: ['./product-commercial-category-card.component.scss'],
})
export class ProductCommercialCategoryCardComponent implements OnInit {
  @Input() cardIndex: number;
  @Input() levelOneCategoriesList: CommercialCategoryModel[];
  @Input() shouldShowDeleteButton: boolean;
  @Input() commercialCategoryFormGroup: FormGroup;
  @Output() deleteCardClicked = new EventEmitter<void>();
  categoryDropdowns:
    {categoryList: (CommercialCategoryModel | CommercialSubCategoryModel)[]; formControlName: string}[];
  loadingCategoriesList = false;
  loadingPreSelectedCategories = false;
  mapping: { [k: string]: string } = {
    '=1': 'Category (level #)',
    other: 'level #',
  };
  formControlNames = commercialCategoriesformControlNames;
  constructor(
    private toast: ToastService,
    private productService: ProductsService,
    private getCommercialSubCategoriesUseCase: GetCommercialSubCategoriesUseCase,
    private getCommercialSubCategoryByIdUseCase: GetCommercialSubCategoryByIdUseCase,
  ) { }
  ngOnInit(): void {
    this.categoryDropdowns = this.formControlNames.map(name => ({
      categoryList: [],
      formControlName: name,
    }));
    this.categoryDropdowns[0].categoryList = this.levelOneCategoriesList;
    this.getPreSelectedCategoryHeirarchy();
  }
  onDeleteButtonClicked(): void {
    this.deleteCardClicked.emit();
  }
  onCategorySelected(selectedCategoryId: string, selectedCategoryLevelIndex: number): void {
    if(selectedCategoryLevelIndex !== this.categoryDropdowns.length - 1) {
      this.categoryDropdowns =
        this.categoryDropdowns.map((categoryDropdown, idx) =>
        idx <= selectedCategoryLevelIndex ?
          categoryDropdown : {...categoryDropdown, categoryList: []},
        );
      this.loadingCategoriesList = true;
      this.getCommercialSubCategoriesUseCase.execute(selectedCategoryId).pipe(finalize(() => {
        this.loadingCategoriesList = false;
      })).subscribe(categoryList => {
        this.categoryDropdowns[selectedCategoryLevelIndex + 1].categoryList = categoryList;
      });
    }
  }
  getPreSelectedCategoryHeirarchy(): void {
    const preSelectedCategoryId =
      this.productService.editedVariantGroup?.commercialCategoryIds?
        this.productService.editedVariantGroup.commercialCategoryIds[this.cardIndex - 1] : '';
    if(preSelectedCategoryId) {
      if(this.isCategoryOnLevelOne(preSelectedCategoryId)) {
        this.commercialCategoryFormGroup.get(levelOneCommercialCategoryFormControlName).setValue(preSelectedCategoryId);
        this.onCategorySelected(preSelectedCategoryId, 0);
      } else {
        this.loadingPreSelectedCategories = true;
        this.getCommercialSubCategoryByIdUseCase.execute(preSelectedCategoryId).subscribe(preSelectedCategory => {
          this.fetchPreSelectedCategoryHeirarchyLists(preSelectedCategory);
        }, (err: HttpErrorResponse) => {
          this.loadingPreSelectedCategories = false;
          const errorMessage = err.error?.description ?? 'An error occurred while fetching commercial categories!';
          this.toast.showToast('Error', errorMessage);
        });
      }
    }
  }
  isCategoryOnLevelOne(preSelectedCategoryId): boolean {
    return !!this.levelOneCategoriesList.filter(category => category.id === preSelectedCategoryId).length;
  }
  fetchPreSelectedCategoryHeirarchyLists(preSelectedCategory: CommercialSubCategoryModel): void {
    forkJoin(
      preSelectedCategory.ancestors.map(
        category => this.getCommercialSubCategoriesUseCase.execute(category.id),
      ),
    ).pipe(finalize(() => {
      this.loadingPreSelectedCategories = false;
    })).subscribe(categoryLists => {
      this.categoryDropdowns = this.categoryDropdowns.map((categoryDropdown, currentIndex) => ({
        ...categoryDropdown,
        categoryList: currentIndex === 0 ? this.levelOneCategoriesList : categoryLists[currentIndex - 1],
      }));
      const formGroupValues = {};
      /* creating formGroupValues from preSelectedCategory and its ancestors */
      for(const [currentIndex, formControlName] of this.formControlNames.entries()) {
        if( currentIndex === preSelectedCategory.ancestors.length) {
          formGroupValues[formControlName] = preSelectedCategory.id;
        } else {
          formGroupValues[formControlName] = preSelectedCategory.ancestors[currentIndex]?.id;
        }
      }
      this.commercialCategoryFormGroup.patchValue(formGroupValues);
    }, (err: HttpErrorResponse) => {
      const errorMessage = err.error?.description ?? 'An error occurred while fetching commercial categories!';
      this.toast.showToast('Error', errorMessage);
    });
  }
}
