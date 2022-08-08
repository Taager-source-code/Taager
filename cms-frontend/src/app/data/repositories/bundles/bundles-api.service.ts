/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Mapper } from '@core/base/mapper';
import { BundleModel } from '@core/domain/bundles/bundle.model';
import { BundleEntity, BundleGroupEntity } from '../entities/bundle.entity';
export class BundleRepositoryMapper extends Mapper<BundleEntity, BundleModel> {
  mapFrom(param: BundleEntity): BundleModel {
    const extraImages = [
      param.extraImage1,
      param.extraImage2,
      param.extraImage3,
      param.extraImage4,
      param.extraImage5,
      param.extraImage6,
    ].filter(link => link);
    return ({
      _id: param._id,
      productId: param.prodID,
      price: param.productPrice,
      purchasePrice: param.prodPurchasePrice,
      profit: param.productProfit,
      variantImages: [param.productPicture, ...extraImages, ...(param.additionalMedia || [])],
      videosLinks: param.embeddedVideos ? [...param.embeddedVideos] : [],
      description: param.productDescription,
      specifications: param.specifications,
      attributes: param.attributes,
      isExpired: param.isExpired,
      quantity: param.productQuantity,
      productAvailability: param.productAvailability,
      productName: param.productName,
      orderCount: param.orderCount,
      visibleToSellers: param.visibleToSellers ?? [],
      type: param.type,
      bundleVariants: param.bundleVariants.map(variant => ({
        sku: variant.id,
        quantity: variant.quantity,
        arabicName: variant.arabicName,
        englishName: variant.englishName,
      })),
      isPrimary: param.isPrimary,
      Category: param.Category,
    });
  }
  mapTo(param: BundleModel): BundleEntity {
    const [productPicture, extraImage1, extraImage2, extraImage3,
      extraImage4, extraImage5, extraImage6, ...additionalMedia] = param.variantImages;
    return ({
      Category: param.Category,
      attributes: param.attributes,
      embeddedVideos: param.videosLinks,
      additionalMedia: additionalMedia ? additionalMedia : [],
      extraImage1: extraImage1 ? extraImage1 : '',
      extraImage2: extraImage2 ? extraImage2 : '',
      extraImage3: extraImage3 ? extraImage3 : '',
      extraImage4: extraImage4 ? extraImage4 : '',
      extraImage5: extraImage5 ? extraImage5 : '',
      extraImage6: extraImage6 ? extraImage6 : '',
      isExpired: param.isExpired,
      prodID: param.productId,
      prodPurchasePrice: param.purchasePrice,
      productAvailability: param.productAvailability,
      productDescription: param.description,
      productName: param.productName,
      productPicture: productPicture ? productPicture : '',
      productPrice: param.price,
      productProfit: param.profit,
      productQuantity: param.quantity,
      specifications: param.specifications,
      _id: param._id,
      isPrimary: param.isPrimary,
      orderCount: param.orderCount || 0,
      visibleToSellers: param.visibleToSellers ?? [],
      type: param.type,
      bundleVariants: param.bundleVariants.map(variant => ({
        id: variant.sku,
        quantity: variant.quantity,
        englishName: variant.englishName,
        arabicName: variant.arabicName,
      })),
    });
  }
}
