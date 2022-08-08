import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class DeleteCommercialCategoryUseCase
  implements UseCase<string, { isCategoryDeleted: boolean }> {
  constructor(private commercialCategoryRepository: CommercialCategoryRepository) {}
  execute(categoryId: string): Observable<{ isCategoryDeleted: boolean }> {
    return this.commercialCategoryRepository.deleteCommercialCategory(categoryId);
  }