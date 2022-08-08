import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { InternalCategoryRepository } from '../../repositories/internal-category.repository';
export class DeleteInternalCategoryUseCase implements UseCase<string , {isCategoryDeleted: boolean}> {
  constructor(private internalCategoryRepository: InternalCategoryRepository) { }
  execute(categoryId: string): Observable<{isCategoryDeleted: boolean}> {
    return this.internalCategoryRepository.deleteInternalCategory(categoryId);
  }
}