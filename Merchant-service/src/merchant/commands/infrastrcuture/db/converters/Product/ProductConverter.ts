import ProductModel from '../../../../../../content-management/queries/application/models/product/Product';
import Product from '../../../../domain/models/Product';

export default class ProductConverter {
  static toDomain(productModel: ProductModel): Product {
    return new Product(productModel._id, productModel.country, productModel.productPrice, 0, productModel.productPrice);
  }
}


