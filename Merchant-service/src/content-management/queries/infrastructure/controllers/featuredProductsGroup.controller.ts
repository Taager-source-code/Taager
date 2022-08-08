import joi from 'joi';

import { UNPROCESSABLE_ENTITY, OK, NOT_FOUND } from 'http-status';
import {
  featuredProductsGroupStatuses,
  getFeaturedProductsGroupByType,
} from '../../application/usecases/featuredProductsGroup.service';

const mapFeaturedProductsGroupStatus = status => {
  switch (status) {
    case featuredProductsGroupStatuses.FEATURED_PRODUCTS_GROUP_RETRIEVED_SUCCESSFULLY.code:
      return OK;
    case featuredProductsGroupStatuses.FEATURED_PRODUCTS_GROUP_NOT_FOUND.code:
      return NOT_FOUND;
    default:
      return OK;
  }
};

export const getFeaturedProductsGroup = async (req, res) => {
  const schema = joi.object({
    type: joi.number().required(),
  });
  const { error, value: params } = schema.validate(req.params);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  const { status, result } = await getFeaturedProductsGroupByType(params.type, req.country.countryIsoCode3);
  return res.status(mapFeaturedProductsGroupStatus(status)).json(result);
};


