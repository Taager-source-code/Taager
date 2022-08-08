import joi from 'joi';

import { UNPROCESSABLE_ENTITY, OK, NOT_FOUND } from 'http-status';
import {
  favouriteProduct,
  unFavouriteProduct,
  getFavouriteProducts,
  isProductInFavourites,
  updateProductCustomPrice,
} from '../../../commands/application/usecases/product/favouriteProducts.service';
import { ProductNotFoundError } from '../../../../content-management/commands/domain/exceptions/productNotFound.error';

export const setFavouriteProduct = async (req, res) => {
  const schema = joi
    .object({
      id: joi.string().required(),
    })
    .unknown(true);
  const { error, value: params } = schema.validate(req.params);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  try {
    await favouriteProduct(req.country, params.id, req.decodedToken.user);
    return res.status(OK).json({});
  } catch (err) {
    if (err instanceof ProductNotFoundError) {
      return res.status(NOT_FOUND).json({});
    }
    throw err;
  }
};

export const unsetFavouriteProduct = async (req, res) => {
  const schema = joi
    .object({
      id: joi.string().required(),
    })
    .unknown(true);
  const { error, value: params } = schema.validate(req.params);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  await unFavouriteProduct(req.country, params.id, req.decodedToken.user);
  return res.status(OK).json({});
};

export const favouriteProductsList = async (req, res) => {
  const result = await getFavouriteProducts(req.country, req.decodedToken.user);
  return res.status(OK).json(result);
};

export const isProductFavourite = async (req, res) => {
  const schema = joi
    .object({
      id: joi.string().required(),
    })
    .unknown(true);
  const { error, value: params } = schema.validate(req.params);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  const result = await isProductInFavourites(req.country, params.id, req.decodedToken.user);
  return res.status(OK).json(result);
};

export const updateProductPrice = async (req, res) => {
  const schema = joi
    .object({
      params: {
        id: joi.string().required(),
      },
      body: {
        price: joi.number().required(),
      },
    })
    .unknown(true);
  const { error, value } = schema.validate(req);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  const result = await updateProductCustomPrice(
    req.country,
    value.params.id,
    value.body.price,
    value.decodedToken.user,
  );
  return res.status(OK).json(result);
};


