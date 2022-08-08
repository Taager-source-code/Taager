class ProductNotFoundError extends Error {
  id: any;
  constructor(id) {
    super('Product not found');
    this.id = id;
  }
}

export { ProductNotFoundError };


