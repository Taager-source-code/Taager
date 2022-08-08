/* eslint-disable @typescript-eslint/naming-convention  */
import { environment } from '@environments/environment';
export const API_URLS = {
  /* Internal Categories URLs */
  GET_INTERNAL_CATEGORIES_URL: `${environment.BACKEND_URL}api/internal-categories/roots`,
  GET_INTERNAL_SUB_CATEGORIES_URL: id => `${environment.BACKEND_URL}api/internal-categories/${id}/children`,
  GET_INTERNAL_SUB_CATEGORY_BY_ID_URL: id => `${environment.BACKEND_URL}api/internal-categories/${id}`,
  CREATE_INTERNAL_CATEGORY_URL: `${environment.BACKEND_URL}api/internal-categories/root`,
  CREATE_INTERNAL_SUB_CATEGORY_URL: `${environment.BACKEND_URL}api/internal-categories/child`,
  EDIT_INTERNAL_CATEGORY_URL: id => `${environment.BACKEND_URL}api/internal-categories/${id}`,
  EDIT_INTERNAL_SUB_CATEGORY_URL: id => `${environment.BACKEND_URL}api/internal-categories/${id}`,
  DELETE_INTERNAL_CATEGORY_URL: id => `${environment.BACKEND_URL}api/internal-categories/${id}`,
  DELETE_INTERNAL_SUB_CATEGORY_URL: id => `${environment.BACKEND_URL}api/internal-categories/${id}`,
  /* Commercial Categories URLs */
  GET_COMMERCIAL_CATEGORIES_URL: `${environment.BACKEND_URL}api/commercial-categories/roots`,
  GET_COMMERCIAL_SUB_CATEGORIES_URL: id => `${environment.BACKEND_URL}api/commercial-categories/${id}/children`,
  GET_COMMERCIAL_SUB_CATEGORY_BY_ID_URL: id => `${environment.BACKEND_URL}api/commercial-categories/${id}`,
  CREATE_COMMERCIAL_CATEGORY_URL: `${environment.BACKEND_URL}api/commercial-categories/root`,
  CREATE_COMMERCIAL_SUB_CATEGORY_URL: `${environment.BACKEND_URL}api/commercial-categories/child`,
  EDIT_COMMERCIAL_CATEGORY_URL: id => `${environment.BACKEND_URL}api/commercial-categories/root/${id}`,
  EDIT_COMMERCIAL_SUB_CATEGORY_URL: id => `${environment.BACKEND_URL}api/commercial-categories/child/${id}`,
  DELETE_COMMERCIAL_CATEGORY_URL: id => `${environment.BACKEND_URL}api/commercial-categories/${id}`,
  DELETE_COMMERCIAL_SUB_CATEGORY_URL: id => `${environment.BACKEND_URL}api/commercial-categories/${id}`,
  /* Variant groups URLs */
  VARIANT_GROUP_URL: `${environment.BACKEND_URL}api/variantGroup`,
  VARIANT_GROUP_LIST_URL: `${environment.BACKEND_URL}api/variantGroup/list`,
  VARIANT_GROUP_BY_ID_URL: id => `${environment.BACKEND_URL}api/variantGroup/${id}`,
  UPLOAD_IMAGE_URL: `${environment.BACKEND_URL}api/product/addProdImage`,
  COUNTRIES_LIST_URL: `${environment.BACKEND_URL}api/countries`,
  CATEGOIES_URL: `${environment.BACKEND_URL}api/category/getCategories`,
  VARIANT_BY_PRODUCT_SKU: (
    sku: string,
    country: string,
  ) => `${environment.BACKEND_URL}api/variants/${sku}?country=${country}`,
  /* User URLs */
  GET_USER_URL: objectId => `${environment.BACKEND_URL}api/user/viewUserProfile/${objectId}`,
  GET_USER_BY_TAAGER_ID: taagerId => `${environment.BACKEND_URL}api/user/getUserByTaagerId/${taagerId}`,
};
export const AVAILABILITY_STATUSES = [
  {
    name: 'متوفر',
    code: 'available',
  },
  {
    name: 'متوفر بكمية كبيرة',
    code: 'available_with_high_qty',
  },
  {
    name: 'متوفر بكمية محدودة',
    code: 'available_with_low_qty',
  },
  {
    name: 'غير متوفر',
    code: 'not_available',
  },
];
export const PRODUCT_INPUTS = [
  {
    name: 'Product Price',
    formControlName: 'productPrice',
    type: 'number',
  },
  {
    name: 'Product Purchase Price',
    formControlName: 'productPurchasePrice',
    type: 'number',
  },
  {
    name: 'Product Profit',
    formControlName: 'productProfit',
    type: 'number',
  },
  {
    name: 'Product ID',
    formControlName: 'productID',
    type: 'text',
  },
  {
    name: 'Product Weight',
    formControlName: 'productWeight',
    type: 'number',
  },
  {
    name: 'Product Quantity',
    formControlName: 'productQuantity',
    type: 'number',
  },
];
export const DEFAULT_SEARCH_FILTERS = {
  page: 1,
  pageSize: 25,
  filter: {
    country: 'EGY',
  },
};
export const DEFAULT_SEARCH_FILTERS_BUNDLES = {
  page: 1,
  pageSize: 25,
  filter: {
    country: 'EGY',
  },
};
export const VARIANT_TABLE_HEADERS_PRE_VARIANTS = [
  'PRIMARY',
  'IMAGE',
];
export const VARIANT_TABLE_HEADERS_POST_VARIANTS = [
  'SELLING PRICE',
  'PROFIT',
  'PRODUCT ID',
  'AVAILABILITY',
  'EXPIRED',
  'DISABLED',
];
export const LOCALSTORAGE_USERNAME_KEY = 'userName';
export const LOCALSTORAGE_TOKEN_KEY = 'user';
