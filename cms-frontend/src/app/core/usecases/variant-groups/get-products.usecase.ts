import { UseCase } from '@core/base/use-case';
import { PaginatedVariantGroupList, VariantGroupFilterModel } from '@core/domain/variant-group.model';
import { VariantGroupsRepository } from '@core/repositories/variant-groups.repository';
import { Observable } from 'rxjs';
export class GetProductsUseCase implements UseCase<VariantGroupFilterModel, PaginatedVariantGroupList>{
    constructor(private variantGroupRepository: VariantGroupsRepository){ }
    execute(filter: VariantGroupFilterModel): Observable<PaginatedVariantGroupList>{
       return this.variantGroupRepository.getProducts(filter);
    }
}
