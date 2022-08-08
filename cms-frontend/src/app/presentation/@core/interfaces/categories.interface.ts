import {
  InternalCategoryModel,
  InternalCategoryName,
  InternalSubCategoryModel,
} from '@core/domain/internal-category.model';
import {
  CommercialCategoryModel,
  CommercialCategoryName,
  CommercialSubCategoryModel,
} from '@core/domain/commercial-category.model';
export type CategoryModel = InternalCategoryModel | CommercialCategoryModel;
export type SubCategoryModel = InternalSubCategoryModel | CommercialSubCategoryModel;
export type CategoryName = InternalCategoryName | CommercialCategoryName;
export interface SubCategoryLevel {
  level: number;
  parentCategory: CategoryModel | SubCategoryModel;
  selectedSubCategoryId: string;
  subCategoriesList: SubCategoryModel[];
  subCategoryListLoading: boolean;
}
