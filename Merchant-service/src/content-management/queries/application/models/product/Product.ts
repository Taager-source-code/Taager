export default interface Product {
  productName: string;
  productPrice: number;
  prodPurchasePrice: number;
  productProfit: number;
  productQuantity: number;
  productDescription: string;
  prodID: string;
  country: string;
  productWeight: number | undefined;
  Category: string;
  categoryId: string | undefined;
  seller: string | undefined;
  sellerName: string;
  productPicture: string;
  featured: boolean;
  inStock: boolean | undefined;
  extraImage1: string | undefined;
  extraImage2: string | undefined;
  extraImage3: string | undefined;
  extraImage4: string | undefined;
  extraImage5: string | undefined;
  extraImage6: string | undefined;
  isExpired: boolean | undefined;
  isExternalRetailer: boolean | undefined;
  visibleToSellers: string[];
  productAvailability: string;
  orderCount: number | undefined;
  additionalMedia: any[];
  embeddedVideos: any[];
  specifications: string;
  howToUse: string | undefined;
  variants: any;
  attributes: any[];
  _id: string;
}


