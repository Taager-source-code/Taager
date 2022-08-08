import { UseCase } from '@core/base/use-case';
import { VariantGroupModel } from '@core/domain/variant-group.model';
import { VariantGroupsRepository } from '@core/repositories/variant-groups.repository';
import { Observable } from 'rxjs';
export class GetProductByIdUseCase implements UseCase<string, VariantGroupModel>{
    constructor(private variantGroupRepository: VariantGroupsRepository){ }
    execute(productId: string): Observable<VariantGroupModel>{
       return this.variantGroupRepository.getProductById(productId);
    }
}
