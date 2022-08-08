import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalCategoryName } from '../../domain/internal-category.model';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class CreateInternalSubCategoryUseCase
  implements UseCase<{parentCategoryId: string; name: InternalCategoryName}, void> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(
    params: {parentCategoryId: string; name: InternalCategoryName},
  ): Observable<void> {
    return this.internalCategoryRepository.createInternalSubCategory(params);
  }
}
