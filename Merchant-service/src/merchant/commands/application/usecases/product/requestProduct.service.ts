import { addRequestedProduct } from '../../../infrastrcuture/repositories/requestProduct.repository';

import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';

export const addNewRequestedProduct = async newProduct => {
  await addRequestedProduct(newProduct);
  Logger.info('successfully added new product in requestedProducts collection', {
    category: newProduct.category,
    productDetails: newProduct.productDetails,
  });
};


