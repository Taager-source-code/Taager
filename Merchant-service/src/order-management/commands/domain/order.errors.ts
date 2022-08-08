export class TooLowProductPriceError extends Error {
  orderPrice: any;
  product: any;
  constructor(product, orderPrice) {
    super(`Product sold below base price; orderPrice=${orderPrice}, product=${JSON.stringify(product)}`);
    this.product = product;
    this.orderPrice = orderPrice;
  }
}

export class InvalidProvinceError extends Error {
  province: any;
  constructor(province) {
    super(`Province not in our database; selectedProvince=${province}`);
    this.province = province;
  }
}


