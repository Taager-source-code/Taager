import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { CommercialSubCategoryModel } from '@core/domain/commercial-category.model';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
export class UpdateCommercialSubCategoryUseCase
  implements UseCase<CommercialSubCategoryModel, CommercialSubCategoryModel> {
  constructor(
    private commercialCategoryRepository: CommercialCategoryRepository,
  ) {}
  execute(
    updatedSubCategory: CommercialSubCategoryModel,
  ): Observable<CommercialSubCategoryModel> {
    return this.commercialCategoryRepository.updateCommercialSubCategory(
      updatedSubCategory,
    );
  }
}