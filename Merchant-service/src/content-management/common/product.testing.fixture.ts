export const RED_BLUE_COLOR_SET = {
  type: 'color',
  category: 'clothing',
  attributes: [{ name: 'red' }, { name: 'blue' }],
};

export const XL_L_SIZE_SET = {
  type: 'size',
  category: 'clothing',
  attributes: [{ name: 'XL' }, { name: 'L' }],
};

export const RED_COLOR = { type: 'color', value: 'red' };

export const XL_SIZE = { type: 'size', value: 'XL' };
export const L_SIZE = { type: 'size', value: 'L' };
export const M_SIZE = { type: 'size', value: 'M' };

export const BLUE_COLOR = { type: 'color', value: 'blue' };

interface Attribute {
  type: string;
  value: string;
}
export const aVariant: any = (prodId, attributes: Attribute[] = [], country = 'EGY') => ({
  productName: 'some product name',
  productPrice: 200,
  prodPurchasePrice: 200,
  productProfit: 100,
  productQuantity: 1,
  productDescription: 'some description',
  prodID: prodId,
  country: country,
  Category: 'some category',
  productPicture: 'http://some-product-image.com',
  extraImage1: 'bla',
  extraImage2: 'bla',
  extraImage3: 'bla',
  extraImage4: 'bla',
  extraImage5: 'bla',
  extraImage6: 'bla',
  productAvailability: 'available',
  orderCount: 0,
  sellerName: 'sellerName',
  attributes,
});

export const aExistingVariant = (id, prodId, attributes: Attribute[] = []) => {
  const variant = aVariant(prodId, attributes);
  variant._id = id;
  return variant;
};


