import { OK } from 'http-status';

import joi, { Schema } from 'joi';

import { Service } from 'typedi';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import SearchVariantGroups from '../../../application/usecases/variant/SearchVariantGroups';

@Service({ global: true })
export default class SearchVariantGroupsController extends HttpProcessor {
  private searchVariantGroups: SearchVariantGroups;

  constructor(searchVariantGroups: SearchVariantGroups) {
    super();
    this.searchVariantGroups = searchVariantGroups;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    const variantGroups = await this.searchVariantGroups.execute({
      pageSize: joiValidatedValue.pageSize,
      page: joiValidatedValue.page,
      query: joiValidatedValue.query,
      countable: joiValidatedValue.countable,
      sortBy: joiValidatedValue.sortBy,
      category: joiValidatedValue.category,
      commercialCategoryIds: [joiValidatedValue.commercialCategoryId],
      userId: req.decodedToken.user._id,
      country: req.country.countryIsoCode3,
    });
    return {
      status: OK,
      data: variantGroups,
    };
  }

  schema: Schema = joi.object({
    pageSize: joi
      .number()
      .integer()
      .min(1)
      .default(10),
    page: joi
      .number()
      .integer()
      .default(1)
      .min(1),
    query: joi
      .string()
      .default('')
      .trim(),
    countable: joi.boolean().default(true),
    sortBy: joi
      .string()
      .required()
      .valid('createdAt', 'updatedAt', 'orderCount', 'productPrice', 'productProfit'),
    category: joi.string().trim(),
    commercialCategoryId: joi.string(),
  });
}


