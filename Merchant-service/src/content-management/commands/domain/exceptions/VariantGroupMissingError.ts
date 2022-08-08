class VariantGroupMissingError extends Error {
  id: any;
  constructor(id) {
    super('Variant group not found');
    this.id = id;
  }
}

export { VariantGroupMissingError };


