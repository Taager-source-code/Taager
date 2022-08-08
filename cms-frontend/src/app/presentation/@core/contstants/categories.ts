import { SubCategoryLevel } from '../interfaces/categories.interface';
export enum CategoryTypes {
  internal = 'Internal',
  commercial = 'Commercial',
};
export const getInitializedSubCategoryLevels = (params: {count: number}) => {
  const subCategoryLevels: SubCategoryLevel[] = [];
  for(let index = 0; index < params.count; index++) {
    subCategoryLevels.push({
      level: index + 2,
      parentCategory: undefined,
      selectedSubCategoryId: undefined,
      subCategoryListLoading: false,
      subCategoriesList: [],
    });
  }
  return subCategoryLevels;
};
export const levelOneCommercialCategoryFormControlName = 'levelOneCategoryId';
export const levelTwoCommercialCategoryFormControlName = 'levelTwoCategoryId';
export const levelThreeCommercialCategoryFormControlName = 'levelThreeCategoryId';
export const levelFourCommercialCategoryFormControlName = 'levelFourCategoryId';
export const commercialCategoriesformControlNames = [
  levelOneCommercialCategoryFormControlName,
  levelTwoCommercialCategoryFormControlName,
  levelThreeCommercialCategoryFormControlName,
  levelFourCommercialCategoryFormControlName,
];
export const initialCommercialCategoriesFormGroup = {
  [levelOneCommercialCategoryFormControlName]: undefined,
  [levelTwoCommercialCategoryFormControlName]: undefined,
  [levelThreeCommercialCategoryFormControlName]: undefined,
  [levelFourCommercialCategoryFormControlName]: undefined,
};
