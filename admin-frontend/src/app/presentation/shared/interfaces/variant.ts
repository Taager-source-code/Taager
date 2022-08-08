import { AttributeSet, AttributeValue } from "./attribute";
export enum ProductAvailability {
  available = "available",
  not_available = "not_available",
  available_with_high_qty = "available_with_high_qty",
  available_with_low_qty = "available_with_low_qty",
  draft = "draft",
}
export interface Variant {
  productName: string;
  productPrice: number;
  prodPurchasePrice: number;
  productProfit: number;
  productQuantity: number;
  productDescription: string;
  prodID: string;
  Category: string;
  productPicture: string;
  extraImage1: string;
  extraImage2: string;
  extraImage3: string;
  extraImage4: string;
  extraImage5: string;
  extraImage6: string;
  productAvailability: ProductAvailability;
  orderCount: number;
  isPrimary: boolean;
  attributes: AttributeValue[];
  _id?: string;
  categoryId?: string;
  specifications?: string;
  productWeight?: number;
  howToUse?: string;
  isExpired?: boolean;
  isExternalRetailer?: boolean;
  visibleToSellers?: string[];
  additionalMedia?: string[];
  embeddedVideos?: string[];
  country: string;
}
export interface VariantTableRowData extends Variant {
  disabled?: boolean;
  preSelected?: boolean;
  isMissingImages?: boolean;
}
export interface VariantGroup {
  name: string;
  categoryId: string;
  visibleToSellers: string[];
  variants: VariantTableRowData[];
  attributeSets: AttributeSet[];
  createdAt?: string;
  isExpired?: boolean;
  primaryVariant?: string;
  updatedAt?: string;
  __v?: number;
  _id?: string;
  country: string;
}
export interface VariantGroupCreationResponse {
  _id?: string;
}
export interface VariantGroupListRequest {
  pageSize: number;
  page: number;
  filter: VariantGroupListFilter;
}
export interface VariantGroupListFilter {
  prodID?: string;
  category?: string;
  productAvailability?: string;
  country?: string;
}
export interface VariantGroupListItem {
  _id: string;
  primaryVariant: Variant;
}
export interface VariantGroupListResponse {
  variantGroups: VariantGroupListItem[];
  counted: number;
  isLastPage: boolean;
}
