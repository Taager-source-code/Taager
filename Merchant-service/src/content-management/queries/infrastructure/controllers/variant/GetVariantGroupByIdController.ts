import { OK } from 'http-status';
import { Schema } from 'joi';

import { Service } from 'typedi';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import { Request } from 'express';
import GetVariantGroupById from '../../../application/usecases/variant/GetVariantGroupById';
import { ObjectIdSchema } from './schemas/ObjectIdSchema';
import ErrorConverter from './converter/ErrorConverter';

@Service({ global: true })
export default class GetVariantGroupByIdController extends HttpProcessor {
  private getVariantGroupById: GetVariantGroupById;

  constructor(getVariantGroupById: GetVariantGroupById) {
    super();
    this.getVariantGroupById = getVariantGroupById;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const variantGroup = await this.getVariantGroupById.execute(joiValidatedValue.id, req.country.countryIsoCode3);
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


