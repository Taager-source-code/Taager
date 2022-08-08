export default class Product {
  private readonly _id: string;
  private readonly _country: string;
  private readonly _basePrice: number;
  private _quantity: number;
  private _preferredMerchantPrice: number;

  constructor(id: string, country: string, basePrice: number, quantity: number, preferredMerchantPrice: number) {
    this._id = id;
    this._country = country;
    this._basePrice = basePrice;
    this._quantity = quantity;
    this._preferredMerchantPrice = preferredMerchantPrice;
  }

  static create(id: string, country: string, price: number): Product {
    return new Product(id, country, price, 0, price);
  }

  increaseQuantity(quantity: number) {
    this._quantity += Math.abs(quantity);
  }

  setQuantity(quantity: number) {
    this._quantity = Math.abs(quantity);
  }

  updatePrice(preferredMerchantPrice: number) {
    this._preferredMerchantPrice = this.normalizePrice(this.basePrice, preferredMerchantPrice);
  }

  private normalizePrice(basePrice, preferredMerchantPrice) {
    if (preferredMerchantPrice >= basePrice) {
      return preferredMerchantPrice;
    }
    return basePrice;
  }

  get id(): string {
    return this._id;
  }

  get country(): string {
    return this._country;
  }

  get basePrice(): number {
    return this._basePrice;
  }

  get preferredMerchantPrice(): number {
    return this._preferredMerchantPrice;
  }

  get quantity(): number {
    return this._quantity;
  }
}


