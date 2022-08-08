import { VariantGroupModel } from '../../../../infrastructure/db/models/VariantGroupModel';
import Logger from '../../../../../../shared-kernel/infrastructure/logging/general.log';
import { VariantGroupMissingError } from '../../../../../commands/domain/exceptions/VariantGroupMissingError';

export default class VariantGroupCountryValidator {
  static assertVariantGroupInThisCountry(country: string, variantGroup: VariantGroupModel) {
    // check if this variant in the same country the merchant is coming from
    if (variantGroup.country != country) {
      Logger.info('This variant group is not available for this country', {
        variantGroupId: variantGroup._id,
        country: country,
      });
      throw new VariantGroupMissingError(variantGroup._id);
    }
  }
}


