import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@presentation/@core/utils/toast.service';
import { InternalCategoryModel, InternalSubCategoryModel } from '@core/domain/internal-category.model';
import {
  UpdateInternalCategoriesUseCase,
} from '@core/usecases/internal-categories/update-internal-category.usecase';
import {
  GetInternalSubCategoriesUseCase,
} from '@core/usecases/internal-categories/get-internal-subcategories.usecase';
import {
  UpdateInternalSubCategoriesUseCase,
} from '@core/usecases/internal-categories/update-internal-subcategory.usecase';
import {
  DeleteInternalSubCategoryUseCase,
} from '@core/usecases/internal-categories/delete-internal-subcategory.usecase';
import { finalize } from 'rxjs/operators';
import { CategoryTypes, getInitializedSubCategoryLevels } from '@presentation/@core/contstants/categories';
import { SubCategoryLevel, SubCategoryModel } from '@presentation/@core/interfaces/categories.interface';
import { UseCase } from '@core/base/use-case';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'ngx-edit-internal-categories',
  templateUrl: './edit-internal-categories.component.html',
  styleUrls: ['./edit-internal-categories.component.scss'],
})
export class EditInternalCategoriesComponent implements OnInit {
  @Input() internalCategory: InternalCategoryModel;
  @Output() navigateBack = new EventEmitter<void>();
  categoryType: CategoryTypes;
  subCategoryLevels: SubCategoryLevel[];
  editComponentLoading = false;
  constructor(
    private toast: ToastService,
    private updateInternalCategoriesUseCase: UpdateInternalCategoriesUseCase,
    private getInternalSubCategoriesUseCase: GetInternalSubCategoriesUseCase,
    private updateInternalSubCategoriesUseCase: UpdateInternalSubCategoriesUseCase,
    private deleteInternalSubCategoryUseCase: DeleteInternalSubCategoryUseCase,
  ) { }
  ngOnInit(): void {
    this.subCategoryLevels = getInitializedSubCategoryLevels({count: 2});
    this.categoryType = CategoryTypes.internal;
    this.onSelectedSubCategoryChanged({subCategory: this.internalCategory, level: 1});
  }
  onClickBackButton(): void {
    this.navigateBack.emit();
  }
  onConfirmEditInternalCategory(category): void {
    this.updateInternalCategoriesUseCase.execute(category).subscribe(updatedCategory => {
      this.internalCategory = updatedCategory;
      this.toast.showToast('Success', 'Category was successfully updated!');
    }, err => {
      const errorMessage = err.error?.description ?? 'An error occurred!';
      this.toast.showToast('Error', errorMessage);
    });
  }
  /**
   *
   * Function is triggered on selection of a certain sub category to update subCategoryLevels
   *
   * @param event - triggered event from child component
   * @param event.subCategory - selected sub category
   * @param level - level of the selected sub category
   * @description On selection certain actions are performed on different levels
   *    - Levels before the selected sub category's level:
   *        no change
   *    - Level of the selected sub category:
   *        selectedSubCategoryId is updated
   *    - Level next to that of the selected sub category:
   *        selectedSubCategoryId is cleared and parentCategory is updated and subCategoriesList is loaded
   *    - Levels after that:
   *        selectedSubCategoryId and parentCategory and subCategoriesList are cleared
   *
   */
  onSelectedSubCategoryChanged(
    event: {subCategory: InternalCategoryModel | InternalSubCategoryModel; level: number},
  ): void {
    const levelIndex = this.subCategoryLevels.findIndex(subCategoryLevel => subCategoryLevel.level === event.level);
    this.subCategoryLevels = this.subCategoryLevels.map((subCategoryLevelAttributes, index) => {
      const previousToSelectedLevel = index < levelIndex;
      const selectedLevel = index === levelIndex;
      const nextToSelectedLevel = index === levelIndex + 1;
      const afterNextToSelectedLevel = index > levelIndex + 1;
      if (previousToSelectedLevel) {
        return subCategoryLevelAttributes;
      } else if (selectedLevel) {
        return {
          ...subCategoryLevelAttributes,
          selectedSubCategoryId: event.subCategory.id,
        };
      } else if (nextToSelectedLevel) {
        return {
          ...subCategoryLevelAttributes,
          parentCategory: event.subCategory,
          selectedSubCategoryId: undefined,
        };
      } else if (afterNextToSelectedLevel) {
        return {
          ...subCategoryLevelAttributes,
          parentCategory: undefined,
          subCategoriesList: [],
          selectedSubCategoryId: undefined,
        };
      }
    });
    this.getSubCategoryLevelList(event.level + 1);
  }
  getSubCategoryLevelList(level: number): void {
    const levelIndex = this.getLevelIndex(level);
    if(this.subCategoryLevels[levelIndex]) {
      if (this.subCategoryLevels[levelIndex].parentCategory) {
        this.subCategoryLevels[levelIndex].subCategoriesList = [];
        this.performAction(
          this.getInternalSubCategoriesUseCase,
          this.subCategoryLevels[levelIndex].parentCategory.id,
          levelIndex,
        ).subscribe((subCategories: SubCategoryModel[]) => {
            this.subCategoryLevels[levelIndex].subCategoriesList = subCategories;
          }, err => {
            this.showErrorToast(err);
          });
      } else {
        this.subCategoryLevels[levelIndex].subCategoriesList = [];
      }
    }
  }
  onEditSubCategory(event: {subCategory: InternalSubCategoryModel; level: number}): void {
    const levelIndex = this.getLevelIndex(event.level);
    this.performAction(this.updateInternalSubCategoriesUseCase, event.subCategory, levelIndex).subscribe(() => {
      this.toast.showToast('Success', 'Sub-category was successfully edited!');
      this.getSubCategoryLevelList(event.level);
    }, err => {
      this.showErrorToast(err);
    });
  }
  onSubCategoryDeleteClicked(event: {subCategoryId: string; level: number}): void {
    const levelIndex = this.getLevelIndex(event.level);
    this.performAction(this.deleteInternalSubCategoryUseCase, event.subCategoryId, levelIndex).subscribe(() => {
      this.toast.showToast('Success', 'Sub-category was successfully deleted!');
      this.onSelectedSubCategoryChanged(
        {subCategory: this.subCategoryLevels[levelIndex].parentCategory, level: event.level-1},
      );
    }, err => {
      this.showErrorToast(err);
    });
  }
  getLevelIndex(level: number): number {
    return this.subCategoryLevels.findIndex(subCategoryLevel => subCategoryLevel.level === level);
  }
  performAction(useCase: UseCase<unknown, unknown>, params: unknown, levelIndex): Observable<unknown> {
    this.subCategoryLevels[levelIndex].subCategoryListLoading = true;
    return useCase.execute(params).pipe(finalize(() => {
      this.subCategoryLevels[levelIndex].subCategoryListLoading = false;
    }));
  }
  showErrorToast(err: HttpErrorResponse): void {
    const errorMessage = err.error?.description ?? 'An error occurred!';
    this.toast.showToast('Error', errorMessage);
  }
}
