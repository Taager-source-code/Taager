import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalCategoryName } from '../../domain/internal-category.model';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class CreateInternalCategoryUseCase implements UseCase<InternalCategoryName, void> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(categoryName: InternalCategoryName): Observable<void> {
    return this.internalCategoryRepository.createInternalCategory(categoryName);
  }
}