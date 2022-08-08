import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class UpdateCommercialCategoryUseCase
  implements UseCase<CommercialCategoryModel, CommercialCategoryModel> {
  constructor(private commercialCategoryRepository: CommercialCategoryRepository) {}
  execute(
    updatedCategory: CommercialCategoryModel,
  ): Observable<CommercialCategoryModel> {
    return this.commercialCategoryRepository.updateCommercialCategory(
      updatedCategory,
    );
  }
}
