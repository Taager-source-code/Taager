import Product from '../../models/product/Product';
import { GetProductQuery } from '../../models/product/GetProductQuery';

export default interface ProductRepo {
  getProduct(getProductQuery: GetProductQuery): Promise<Product | null>;
}


