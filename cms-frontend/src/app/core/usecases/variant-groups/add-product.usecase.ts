import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { VariantGroupModel } from '@core/domain/variant-group.model';
import { VariantGroupsRepository } from '@core/repositories/variant-groups.repository';
export class AddProductUseCase implements UseCase<VariantGroupModel, void>{
    constructor(private variantGroupRepository: VariantGroupsRepository){ }
    execute(variantGroup: VariantGroupModel): Observable<void> {
        return this.variantGroupRepository.addProduct(variantGroup);
    }
}
