/* eslint-disable @typescript-eslint/naming-convention */
import { Mapper } from '@core/base/mapper';
import { VariantModel } from '@core/domain/variant-group.model';
import { VariantEntity } from '../entities/variant-group-entity';
export class VariantRepositoryMapper extends Mapper<VariantEntity, VariantModel>{
  mapFrom(param: VariantEntity): VariantModel {
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
      country: param.country,
      price: param.productPrice,
      purchasePrice: param.prodPurchasePrice,
      profit: param.productProfit,
      variantImages: [param.productPicture, ...extraImages, ...(param.additionalMedia || [])],
      videosLinks: param.embeddedVideos ? [...param.embeddedVideos] : [],
      description: param.productDescription,
      specifications: param.specifications,
      inStock: param.inStock,
      howToUse: param.howToUse,
      attributes: param.attributes,
      isExpired: param.isExpired,
      quantity: param.productQuantity,
      weight: param.productWeight,
      sellerName: param.sellerName,
      productAvailability: param.productAvailability,
      categoryName: param.Category,
      categoryId: param.categoryId,
      productName: param.productName,
      orderCount: param.orderCount,
      visibleToSellers: param.visibleToSellers ?? [],
      isDisabled: false,
    });
  }
  mapTo(param: VariantModel): VariantEntity {
    const [productPicture, extraImage1, extraImage2, extraImage3,
      extraImage4, extraImage5, extraImage6, ...additionalMedia] = param.variantImages;
    return ({
      Category: param.categoryName,
      categoryId: param.categoryId,
      attributes: param.attributes,
      country: param.country,
      embeddedVideos: param.videosLinks,
      additionalMedia: additionalMedia ? additionalMedia : [],
      extraImage1: extraImage1 ? extraImage1 : '',
      extraImage2: extraImage2 ? extraImage2 : '',
      extraImage3: extraImage3 ? extraImage3 : '',
      extraImage4: extraImage4 ? extraImage4 : '',
      extraImage5: extraImage5 ? extraImage5 : '',
      extraImage6: extraImage6 ? extraImage6 : '',
      howToUse: param.howToUse,
      inStock: param.inStock,
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
      productWeight: param.weight,
      sellerName: param.sellerName,
      specifications: param.specifications,
      _id: param._id,
      isPrimary: param.isPrimary,
      orderCount: param.orderCount || 0,
      visibleToSellers: param.visibleToSellers ?? [],
    });
  }
}
