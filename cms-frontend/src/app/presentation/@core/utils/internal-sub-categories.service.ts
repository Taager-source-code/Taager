import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InternalSubCategoryModel } from '../../../core/domain/internal-category.model';
interface SelectedSubCategories {
  levelTwo: undefined | InternalSubCategoryModel;
  levelThree: undefined | InternalSubCategoryModel;
};
@Injectable({
  providedIn: 'root',
})
export class InternalSubCategoriesService {
  public selectedInternalSubCategories: SelectedSubCategories = {
    levelTwo: undefined,
    levelThree: undefined,
  };
  public levelTwoSelectedSubCategory =
    new BehaviorSubject<InternalSubCategoryModel>(this.selectedInternalSubCategories.levelTwo);
  public levelThreeSelectedSubCategory =
    new BehaviorSubject<InternalSubCategoryModel>(this.selectedInternalSubCategories.levelThree);
  constructor() { }
  selectSubCategory(params: {subCategory: InternalSubCategoryModel; level: number}): void {
    switch (params.level) {
      case 2:
        if(this.selectedInternalSubCategories.levelTwo?.id !== params.subCategory?.id) {
          this.selectedInternalSubCategories.levelTwo = params.subCategory;
          this.levelTwoSelectedSubCategory.next(this.selectedInternalSubCategories.levelTwo);
        }
      break;
      case 3:
        if(this.selectedInternalSubCategories.levelThree?.id !== params.subCategory?.id) {
          this.selectedInternalSubCategories.levelThree = params.subCategory;
          this.levelThreeSelectedSubCategory.next(this.selectedInternalSubCategories.levelThree);
        }
      break;
    }
  }
  clearSubCategorySelection(): void{
    this.selectSubCategory({subCategory: undefined, level: 2});
    this.selectSubCategory({subCategory: undefined, level: 3});
  }
}
