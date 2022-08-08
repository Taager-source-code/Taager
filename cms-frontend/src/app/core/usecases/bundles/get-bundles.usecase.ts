import { UseCase } from '@core/base/use-case';
import { BundleFilterModel, PaginatedBundleList } from '@core/domain/bundles/bundle-filter.model';
import { BundleModel } from '@core/domain/bundles/bundle.model';
import { BundleRepository } from '@core/repositories/bundle.repository';
import { Observable } from 'rxjs';
export class GetBundlesUseCase implements UseCase<BundleFilterModel, PaginatedBundleList> {
  constructor(private bundlesRepository: BundleRepository) {};
  execute(filters: BundleFilterModel): Observable<PaginatedBundleList> {
    return this.bundlesRepository.getBundles(filters);
  }
}