import {
    BundleAttributesProductsVariantTypes,
} from '@presentation/pages/bundles/bundle-manager/bundle-attributes/bundle-attributes-products/interfaces/interfaces';
export interface BundleVariantModel {
    sku: string;
    quantity: number;
    arabicName?: string;
    englishName?: string;
}