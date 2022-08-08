import { BundleVariantModel } from '@core/domain/bundles/bundle-variant.model';
import { BundleGroupModel, BundleModel } from '@core/domain/bundles/bundle.model';
export interface BundleUISectionsInfo {
    productAvailability: string;
    defaultImage: string;
    productName: string;
    productId: string;
    price: number;
    profit: number;
    visibleToSellers: string;
    isExpired: boolean;
}
export interface BundleUISectionsAttributesDetails {
    bundleDescription: string;
    bundleSpecification: string;
    bundleVideoLinks: Array<string>;
}
export interface BundleUISectionsAttributesCategories {
    internalCategoryId: string;
    categoryId: string;
    commercialCategoryIds: Array<string>;
}
export interface BundleUISectionsAttributes {
    details: BundleUISectionsAttributesDetails;
    products: Array<BundleVariantModel>;
    category: BundleUISectionsAttributesCategories;
    images: Array<string>;
}
export interface BundleUISections {
    bundleSavedCountry: string;
    info?: BundleUISectionsInfo;
    attributes?: BundleUISectionsAttributes;
}
/**
 * A deserializer which will unmarshall the received bundle into it's constituent UI
 * parts.
 */
export const productVariantGroupDeserializer = (bundleGroupModel: BundleGroupModel): BundleUISections => ({
    info: getBundleFormGroupInfo(bundleGroupModel.primaryVariant),
    attributes: getBundleFormGroupAttributes(bundleGroupModel),
    bundleSavedCountry: bundleGroupModel.country,
});
const getBundleFormGroupInfo = (primaryVariant: BundleModel): BundleUISectionsInfo => ({
    productAvailability: primaryVariant.productAvailability,
    defaultImage: primaryVariant.variantImages[0],
    productName: primaryVariant.productName,
    productId: primaryVariant.productId,
    price: primaryVariant.price,
    profit: primaryVariant.profit,
    visibleToSellers: primaryVariant.visibleToSellers.join(','),
    isExpired: primaryVariant.isExpired,
});
const getBundleFormGroupAttributes = (bundleGroupModel: BundleGroupModel): BundleUISectionsAttributes => ({
    details: {
        bundleDescription: bundleGroupModel.primaryVariant.description,
        bundleSpecification: bundleGroupModel.primaryVariant.specifications,
        bundleVideoLinks: bundleGroupModel.primaryVariant.videosLinks,
    },
    products: bundleGroupModel.primaryVariant.bundleVariants,
    category: {
        internalCategoryId: bundleGroupModel.internalCategoryId,
        categoryId: bundleGroupModel.categoryId,
        commercialCategoryIds: bundleGroupModel.commercialCategoryIds,
    },
    images: bundleGroupModel.primaryVariant.variantImages?.slice(1) || [],
});
