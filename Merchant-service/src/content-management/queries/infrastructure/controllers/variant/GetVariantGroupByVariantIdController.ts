import { OK } from 'http-status';
import { Schema } from 'joi';

import { Service } from 'typedi';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import { Request } from 'express';
import GetVariantGroupByVariantId from '../../../application/usecases/variant/GetVariantGroupByVariantId';
import { ObjectIdSchema } from './schemas/ObjectIdSchema';
import ErrorConverter from './converter/ErrorConverter';

@Service({ global: true })
export default class GetVariantGroupByVariantIdController extends HttpProcessor {
  private getVariantGroupByVariantId: GetVariantGroupByVariantId;

  constructor(getVariantGroupByVariantId: GetVariantGroupByVariantId) {
    super();
    this.getVariantGroupByVariantId = getVariantGroupByVariantId;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const variantGroup = await this.getVariantGroupByVariantId.execute(
        joiValidatedValue.id,
        req.country.countryIsoCode3,
      );
      return {
        status: OK,
        data: variantGroup,
      };
    } catch (err) {
      return ErrorConverter.mapError(err);
    }
  }

  getValueToValidate(req: Request): any {
    return req.params;
  }

  schema: Schema = ObjectIdSchema;
}


