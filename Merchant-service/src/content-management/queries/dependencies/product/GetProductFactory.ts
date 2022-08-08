import { Service } from 'typedi';
import ProductRepoImp from '../../infrastructure/repositories/product/ProductRepoImp';
import GetProduct from '../../application/usecases/product/GetProduct';

@Service({ global: true })
export default class GetProductFactory {
  constructor(public productRepo: ProductRepoImp) {}

  create() {
    return new GetProduct(this.productRepo);
  }
}


