import { findAllProducts } from '../../../../../content-management/commands/application/usecases/product.service';

export const getOrderProducts = async ids => {
  const options: any = { _id: { $in: ids } };
  const prods = await findAllProducts(options);

  const products: any[] = [];

  if (prods) {
    await ids.forEach(element => {
      products.push(prods.find(x => x._id.toString() == element.toString()));
    });

    return products;
  }
};


