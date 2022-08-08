import { Observable } from 'rxjs';
import {
  InternalCategoryModel, InternalCategoryName, InternalSubCategoryModel,
} from '../../core/domain/internal-category.model';
export abstract class InternalCategoryRepository {
  abstract createInternalCategory(name: InternalCategoryName): Observable<void>;
  abstract createInternalSubCategory(
    params: {parentCategoryId: string; name: InternalCategoryName}
  ): Observable<void>;
  abstract getInternalCategories(): Observable<InternalCategoryModel[]>;
  abstract getInternalSubCategories(parentCategoryId: string): Observable<InternalSubCategoryModel[]>;
  abstract getInternalSubCategoryById(subCategoryId: string): Observable<InternalSubCategoryModel>;
  abstract updateInternalCategory(updatedCategory: InternalCategoryModel): Observable<InternalCategoryModel>;
  abstract updateInternalSubCategory(
    updatedSubCategory: InternalSubCategoryModel
  ): Observable<InternalSubCategoryModel>;
  abstract deleteInternalCategory(categoryId: string): Observable<{isCategoryDeleted: boolean}>;
  abstract deleteInternalSubCategory(subCategoryId: string): Observable<{isSubCategoryDeleted: boolean}>;
}
