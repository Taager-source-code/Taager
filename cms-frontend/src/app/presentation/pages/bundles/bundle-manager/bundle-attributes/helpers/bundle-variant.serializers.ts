/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Common file which will have serializers to marshall and unmarshall data to and from
 * form data into a BundleModel so that it is compatible witm mapper input
 * decouple info:
 *  decouple attributes
 *  decouple details
 *  decouple products
 *  decouple category
 *  decouple images
 */
import { BundleGroupModel, BundleModel } from '@core/domain/bundles/bundle.model';
import { BundleVariantEntity } from '@data/repositories/bundles/entities/bundle-variant.entity';
const initializeBundleVariantGroup = (): BundleGroupModel => ({
    name: '',
    categoryId: '',
    internalCategoryId: '',
    commercialCategoryIds: [],
    country: '',
    attributeSets: [],
    visibleToSellers: [],
    variants: [],
});
const initializeBundleModelVariant = (): BundleModel => ({
    productName: '', // should be same as variant group name
    price: 0,
    purchasePrice: 0, // leave as zero for now
    profit: 0,
    quantity: 0, // because it is one bundle
    description: '',
    productId: '',
    Category: '',
    variantImages: [],
    productAvailability:  '',
    orderCount: 0, // have it as 1
    isPrimary: true, // have it as true as it is the only item
    attributes: [],
    type: 'bundle',
    bundleVariants: [],
    visibleToSellers: [],
    videosLinks: [],
    specifications: '',
    isExpired: false,
});
export const formDataToBundleModelSerializer = (formData: {[formName: string]: {
    values: any;
    isValid: boolean;
  };}, activeCountry: string, bundleGroupUUID?: string, bundlePrimaryVariantUUID?: string): BundleGroupModel => {
      const saveBundleFormData: BundleGroupModel = initializeBundleVariantGroup();
      const info = returnBundleInfo(formData);
      const details = returnBundleDetails(formData);
      const products = returnBundleProducts(formData);
      const category = returnBundleCategory(formData);
      const images = returnBundleImages(formData);
      saveBundleFormData.name = info.productName;
      saveBundleFormData.categoryId = category.categoryId;
      saveBundleFormData.internalCategoryId = category.internalCategoryId;
      saveBundleFormData.commercialCategoryIds = category.commercialCategoryIds;
      saveBundleFormData.country = activeCountry;
      saveBundleFormData.visibleToSellers = info.visibleToSellers;
      saveBundleFormData.attributeSets = [];
      const bundleVariantItem: BundleModel = initializeBundleModelVariant();
      bundleVariantItem.productName = info.productName;
      bundleVariantItem.price = info.productPrice;
      bundleVariantItem.purchasePrice = 0;
      bundleVariantItem.profit = info.productProfit;
      bundleVariantItem.quantity = 1;
      bundleVariantItem.description = details.productDescription;
      bundleVariantItem.productId = info.prodID;
      bundleVariantItem.Category = category.Category;
      bundleVariantItem.variantImages = [
        info.productPicture,
        ...images,
      ];
      bundleVariantItem.productAvailability = info.productAvailability;
      bundleVariantItem.orderCount = 1;
      bundleVariantItem.isPrimary = true;
      bundleVariantItem.attributes = [];
      bundleVariantItem.type = 'bundle';
      bundleVariantItem.bundleVariants = products.bundleVariants.map(variant => ({
        sku: variant.id,
        quantity: variant.quantity,
        arabicName: variant.arabicName,
        englishName: variant.englishName,
      }));
      bundleVariantItem.visibleToSellers = info.visibleToSellers;
      bundleVariantItem.videosLinks = details.videoLinks;
      bundleVariantItem.specifications = details.productSpecification;
      bundleVariantItem.isExpired = info.isExpired;
      bundleVariantItem._id = bundlePrimaryVariantUUID;
      saveBundleFormData.variants = [bundleVariantItem];
      saveBundleFormData._id = bundleGroupUUID;
      return saveBundleFormData;
};
const returnBundleInfo = (form: {[formName: string]: {
    values: any;
    isValid: boolean;
};}): {
    isExpired: boolean;
    productAvailability: string;
    productName: string;
    productPicture: string;
    productPrice: number;
    productProfit: number;
    prodID: string;
    visibleToSellers: Array<string>;
} => ({
    isExpired: form.info.values.isExpired,
    productAvailability: form.info.values.productAvailability,
    productName: form.info.values.productName,
    productPicture: form.info.values.defaultImage,
    productPrice: form.info.values.price,
    productProfit: form.info.values.profit,
    prodID: form.info.values.productId,
    visibleToSellers: (
        form.info.values.visibleToSellers.split(',') as Array<string>
    ).filter(sellerUUID => sellerUUID !== ''),
});
const returnBundleDetails = (form: {[formName: string]: {
    values: any;
    isValid: boolean;
};}): {
    productDescription: string;
    productSpecification: string;
    videoLinks: Array<string>;
} => ({
    productDescription: form.attributes.values.details.bundleDescription,
    productSpecification: form.attributes.values.details.bundleSpecification,
    videoLinks: form.attributes.values.details.bundleVideoLinks,
});
const returnBundleProducts = (form: {[formName: string]: {
    values: any;
    isValid: boolean;
};}): {
    bundleVariants: Array<BundleVariantEntity>;
} => ({
    bundleVariants: form.attributes.values.products.products.map(product => ({
        arabicName: product.arabicName,
        englishName: product.englishName,
        quantity: product.quantity,
        id: product.sku,
    })) || [],
});
const returnBundleCategory = (form: {[formName: string]: {
    values: any;
    isValid: boolean;
};}) => ({
    categoryId: form.attributes.values.category.categoryId,
    internalCategoryId: form.attributes.values.category.internalCategoryId,
    commercialCategoryIds: form.attributes.values.category.commercialCategoryIds,
    Category: 'unknown',
});
const returnBundleImages = (form: {[formName: string]: {
    values: any;
    isValid: boolean;
  };}): Array<string> => ([
    form.attributes.values.images.bundleImages[0] || '',
    form.attributes.values.images.bundleImages[1] || '',
    form.attributes.values.images.bundleImages[2] || '',
    form.attributes.values.images.bundleImages[3] || '',
    form.attributes.values.images.bundleImages[4] || '',
    form.attributes.values.images.bundleImages[5] || '',
  ].filter(imageUrl => imageUrl));
