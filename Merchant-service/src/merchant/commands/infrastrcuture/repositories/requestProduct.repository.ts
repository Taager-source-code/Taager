import RequestedProducts from '../../../../content-management/common/infrastructure/db/schemas/requestedProduct.models';

export const addRequestedProduct = async requestedProduct => {
  return RequestedProducts.create(requestedProduct);
};


