interface CartProduct {
  qty: number;
  product: string;
  preferredMerchantPrice: number;
}

export default interface CartDbo {
  userId: string;
  country: string;
  products: CartProduct[];
}


