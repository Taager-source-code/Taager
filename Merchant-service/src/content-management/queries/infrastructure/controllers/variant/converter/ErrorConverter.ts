import { NOT_FOUND } from 'http-status';
import { HttpError } from '../../../../../../common/http/HttpProcessor';
import { VariantGroupMissingError } from '../../../../../commands/domain/exceptions/VariantGroupMissingError';

export default class ErrorConverter {
  static mapError(err): HttpError {
    if (err instanceof VariantGroupMissingError) {
      return {
        status: NOT_FOUND,
        errorCode: 'variantgroup-0404',
        description: 'Variant group not found',
      };
    } else throw err;
  }
}


