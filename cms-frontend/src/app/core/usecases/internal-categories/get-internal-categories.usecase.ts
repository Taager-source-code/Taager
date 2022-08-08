import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalCategoryModel } from '../../domain/internal-category.model';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class GetInternalCategoriesUseCase implements UseCase<void , InternalCategoryModel[]> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(): Observable<InternalCategoryModel[]> {
    return this.internalCategoryRepository.getInternalCategories();
  }
}
