import {
  CommercialCategoryModel,
  CommercialCategoryName,
  CommercialSubCategoryModel,
} from '@core/domain/commercial-category.model';
import { Observable } from 'rxjs';
export abstract class CommercialCategoryRepository {
  abstract createCommercialCategory(
    category: CommercialCategoryModel
  ): Observable<void>;
  abstract createCommercialSubCategory(params: {
    parentCategoryId: string;
    name: CommercialCategoryName;
  }): Observable<void>;
  abstract getCommercialCategories(countryCode: string): Observable<CommercialCategoryModel[]>;
  abstract getCommercialSubCategories(
    parentCategoryId: string
  ): Observable<CommercialSubCategoryModel[]>;
  abstract getCommercialSubCategoryById(
    subCategoryId: string
  ): Observable<CommercialSubCategoryModel>;
  abstract updateCommercialCategory(
    updatedCategory: CommercialCategoryModel
  ): Observable<CommercialCategoryModel>;
  abstract updateCommercialSubCategory(
    updatedSubCategory: CommercialSubCategoryModel
  ): Observable<CommercialSubCategoryModel>;
  abstract deleteCommercialCategory(
    categoryId: string
  ): Observable<{ isCategoryDeleted: boolean }>;
  abstract deleteCommercialSubCategory(
    subCategoryId: string
  ): Observable<{ isSubCategoryDeleted: boolean }>;
  abstract toggleFeaturedCommercialCategory(
    category: CommercialCategoryModel
  ): Observable<{ isFeaturedCategory: boolean }>;
}
