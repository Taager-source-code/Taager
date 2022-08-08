import VariantRepo from '../../contracts/VariantRepo';
import { VariantGroupMissingError } from '../../../../commands/domain/exceptions/VariantGroupMissingError';
import { Inject, Service } from 'typedi';
import VariantGroupCountryValidator from './validators/VariantGroupCountryValidator';
import { VariantGroup } from '../../models/variant/VariantGroup';
import VariantRepoImpl from '../../../infrastructure/repositories/VariantRepoImpl';

@Service({ global: true })
export default class GetVariantGroupById {
  private variantRepo: VariantRepo;

  constructor(@Inject(() => VariantRepoImpl) variantRepo: VariantRepo) {
    this.variantRepo = variantRepo;
  }

  async execute(id: string, countryIsoCode3: string): Promise<VariantGroup> {
    const variantGroup = await this.variantRepo.getVariantGroup(id);
    if (!variantGroup) {
      throw new VariantGroupMissingError(id);
    }
    VariantGroupCountryValidator.assertVariantGroupInThisCountry(countryIsoCode3, variantGroup);
    return variantGroup;
  }
}


