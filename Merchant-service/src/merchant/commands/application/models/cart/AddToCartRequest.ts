export type AddToCartRequest = {
  qty: number;
  overwriteQuantity?: boolean;
  pid: string;
  countryIsoCode3: string;
  userId: string;
  preferredMerchantPrice?: number;
};


