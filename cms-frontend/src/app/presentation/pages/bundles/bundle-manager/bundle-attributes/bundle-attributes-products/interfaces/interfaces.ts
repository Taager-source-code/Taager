import { BundleVariantModel } from '@core/domain/bundles/bundle-variant.model';
export type BundleAttributesProductsVariantMode = 'view' | 'edit';
export interface BundleAttributesProductsVariantTypes {
    [variantType: string]: {
        label: string;
        values: Array<string>;
    };
}
export interface BundleAttributesProductsVariant {
    productName: string;
    productPicture: string;
    variants: BundleAttributesProductsVariantTypes | null;
    variantUUID: string;
    mode: BundleAttributesProductsVariantMode;
    productAvailability: {
        value: string;
        label: string;
    };
    sku: string;
    quantity: number;
    arabicName: string;
    englishName: string;
    isNew: boolean;
}
export interface AddedBundleVariantModel extends BundleVariantModel {
    variantUUID: string;
}
