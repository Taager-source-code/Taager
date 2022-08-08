mport { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
export class ToggleFeaturedCommercialCategoryUseCase
  implements UseCase<CommercialCategoryModel, { isFeaturedCategory: boolean }> {
  constructor( private commercialCategoryRepository: CommercialCategoryRepository) {}
  execute(
    category: CommercialCategoryModel,
  ): Observable<{ isFeaturedCategory: boolean }> {
    return this.commercialCategoryRepository.toggleFeaturedCommercialCategory(
      category,
    );
  }
}