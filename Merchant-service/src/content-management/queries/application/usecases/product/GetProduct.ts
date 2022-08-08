import { Service } from 'typedi';
import Product from '../../models/product/Product';
import { NoProductMatchingIdFoundError } from '../../exceptions/product/NoProductMatchingIdFoundError';
import ProductRepo from '../../contracts/product/ProductRepo';
import { GetProductQuery } from '../../models/product/GetProductQuery';
import GetProductFactory from '../../../dependencies/product/GetProductFactory';

@Service({ factory: [GetProductFactory, 'create'] })
export default class GetProduct {
  private productRepo: ProductRepo;

  constructor(productRepo: ProductRepo) {
    this.productRepo = productRepo;
  }

  async execute(getProductQuery: GetProductQuery): Promise<Product | null> {
    const product = await this.productRepo.getProduct(getProductQuery);
    if (!product) throw new NoProductMatchingIdFoundError(getProductQuery._id);
    return product;
  }
}


