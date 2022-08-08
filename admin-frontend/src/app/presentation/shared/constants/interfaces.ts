export interface ProductInterface {
  Category: string;
  categoryId: string;
  createdAt: string;
  extraImage1: string;
  extraImage2: string;
  extraImage3: string;
  extraImage4: string;
  extraImage5: string;
  extraImage6: string;
  featured: boolean;
  isExpired: boolean;
  orderCount: number;
  prodID: string;
  productAvailability: string;
  productDescription: string;
  productName: string;
  productPicture: string;
  productPrice: number;
  productProfit: number;
  productQuantity?: number;
  updatedAt: string;
  visibleToSellers: string[];
  _id: string;
}
