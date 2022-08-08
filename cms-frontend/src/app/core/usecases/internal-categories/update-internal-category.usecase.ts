import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalCategoryModel } from '../../domain/internal-category.model';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class UpdateInternalCategoriesUseCase implements UseCase<InternalCategoryModel , InternalCategoryModel> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(updatedCategory: InternalCategoryModel): Observable<InternalCategoryModel> {
    return this.internalCategoryRepository.updateInternalCategory(updatedCategory);
  }
}