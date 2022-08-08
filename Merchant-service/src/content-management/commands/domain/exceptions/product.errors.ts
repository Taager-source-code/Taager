export default class ProductNotFoundError extends Error {
  productIds: any;
  constructor(productIds) {
    super(`One of the products not found: ${productIds}`);
    this.productIds = productIds;
  }
}


