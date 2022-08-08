export class NoProductMatchingIdFoundError extends Error {
  productId: string;
  constructor(productId: string) {
    super(`No product matching the id=${productId} was found`);
    this.productId = productId;
  }
}


