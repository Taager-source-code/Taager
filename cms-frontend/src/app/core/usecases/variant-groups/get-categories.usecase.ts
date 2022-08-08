import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { VariantGroupsRepository } from '@core/repositories/variant-groups.repository';
import { CategoryFilterModel, CategoryModel } from '@core/domain/variant-group.model';
export class GetCategoriesUseCase implements UseCase<CategoryFilterModel, CategoryModel[]>{
  constructor(private variantGroupRepository: VariantGroupsRepository){ }
  execute(filter: CategoryFilterModel): Observable<CategoryModel[]>{
     return this.variantGroupRepository.getCategories(filter);
  }
}
