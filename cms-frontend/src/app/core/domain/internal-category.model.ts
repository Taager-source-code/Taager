export interface InternalCategoryName {
  englishName: string;
  arabicName: string;
}
export interface InternalCategoryModel {
  id?: string;
  name: InternalCategoryName;
};
export interface InternalSubCategoryModel extends InternalCategoryModel {
  parentCategoryId: string;
  ancestors?: { categoryId: string }[];
}
