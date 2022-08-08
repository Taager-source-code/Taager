import { ProductModel } from '../models/ProductModel';

export class ProductConverter {
  static toApplication(productEntity: ProductModel) {
    return {
      _id: productEntity._id as string,
      productName: productEntity.productName,
      productPrice: productEntity.productPrice,
      prodPurchasePrice: productEntity.prodPurchasePrice,
      productProfit: productEntity.productProfit,
      productQuantity: productEntity.productQuantity,
      productDescription: productEntity.productDescription,
      prodID: productEntity.prodID,
      country: productEntity.country,
      productWeight: productEntity.productWeight,
      Category: productEntity.Category,
      categoryId: productEntity.categoryId as string,
      seller: productEntity.seller as string,
      sellerName: productEntity.sellerName,
      productPicture: productEntity.productPicture,
      featured: productEntity.featured,
      inStock: productEntity.inStock,
      extraImage1: productEntity.extraImage1,
      extraImage2: productEntity.extraImage2,
      extraImage3: productEntity.extraImage3,
      extraImage4: productEntity.extraImage4,
      extraImage5: productEntity.extraImage5,
      extraImage6: productEntity.extraImage6,
      isExpired: productEntity.isExpired,
      isExternalRetailer: productEntity.isExternalRetailer,
      visibleToSellers: productEntity.visibleToSellers as string[],
      productAvailability: productEntity.productAvailability,
      orderCount: productEntity.orderCount,
      additionalMedia: productEntity.additionalMedia,
      embeddedVideos: productEntity.embeddedVideos,
      specifications: productEntity.specifications as string,
      howToUse: productEntity.howToUse,
      variants: productEntity.variants,
      attributes: productEntity.attributes,
    };
  }
}


