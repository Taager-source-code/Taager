import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from 'http-status';
import { findAllProducts, findProductById } from '../../../../commands/application/usecases/product.service';
import { validateNewProductRequest } from './product.validator';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { addNewRequestedProduct } from '../../../../../merchant/commands/application/usecases/product/requestProduct.service';

export const viewProduct = async (req, res) => {
  const prod = await findProductById(req.params.id);
  if (!prod) {
    return res.status(NOT_FOUND).json({
      msg: "Looks like this product doesn't exist!",
    });
  }
  // check if this variant in the same country the merchant is coming from
  if (prod.country != req.country.countryIsoCode3) {
    Logger.info('This variant group is not available for this country', {
      variantGroupId: prod._id,
      country: req.country.countryIsoCode3,
    });
    return res.status(NOT_FOUND).json({
      msg: 'This variant group is not available for this country',
    });
  }

  return res.status(OK).json({
    msg: 'Product Found!',
    data: prod,
  });
};

export const getProductsByProdIds = async (req, res) => {
  const prodIDs = req.body;
  const options = { prodID: { $in: prodIDs } };
  const prods = await findAllProducts(options);

  if (prods) {
    return res.status(OK).json({
      msg: 'Products list found!',
      data: prods.map(item => {
        return item;
      }),
    });
  }

  return res.status(NOT_FOUND).json({
    msg: "Products can't be retrieved",
  });
};

export const getProductsByIds = async (req, res) => {
  const ids = req.body;
  const options = { _id: { $in: ids } };
  const prods = await findAllProducts(options);
  const orderedProds: any[] = [];

  if (prods) {
    ids.forEach((element, index) => {
      orderedProds.push(prods.find(x => x._id == element));

      if (index === ids.length - 1) {
        const finalProducts = orderedProds.map(item => {
          const product = item;
          delete product.prodPurchasePrice;
          delete product.featured;
          delete product.isExternalRetailer;
          delete product.isexternalRetailer;
          return product;
        });
        return res.status(OK).json({
          msg: 'Products list found!',
          data: finalProducts,
        });
      }
    });
  } else {
    return res.status(NOT_FOUND).json({
      msg: "Products can't be retrieved",
    });
  }
};

/**
 * requestProduct add new requested products in DB
 * @param {http req} req
 * @param {http res} res
 * @returns {Promise<http res>}
 */
export const requestProduct = async (req, res) => {
  const { error, value: newProduct } = validateNewProductRequest(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  Logger.debug('Request for adding new product received', {
    category: newProduct.category,
    productDetails: newProduct.productDetails,
  });
  try {
    await addNewRequestedProduct(newProduct);
    return res.status(CREATED).json();
  } catch (err) {
    const error = err as Error;
    Logger.error('Unable to add requested product', {
      error: error.message,
    });
    return res.status(INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};


