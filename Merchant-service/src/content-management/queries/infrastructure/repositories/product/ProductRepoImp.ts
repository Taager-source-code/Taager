import { Service } from 'typedi';
import ProductDao from '../../db/access/product/ProductDao';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import Product from '../../../application/models/product/Product';
import { ProductConverter } from '../../db/converters/ProductConverter';
import ProductRepo from '../../../application/contracts/product/ProductRepo';
import { GetProductQuery } from '../../../application/models/product/GetProductQuery';

@Service({ global: true })
export default class ProductRepoImp implements ProductRepo {
  private productDao: ProductDao;

  constructor(productDao: ProductDao) {
    this.productDao = productDao;
  }

  async getProduct(getProductQuery: GetProductQuery): Promise<Product | null> {
    Logger.info('Get product by id', { id: getProductQuery._id });

    const product = await this.productDao.getProduct(getProductQuery);
    if (!product) return null;
    return ProductConverter.toApplication(product);
  }
}


