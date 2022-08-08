import { UseCase } from '@core/base/use-case';
import { BundleGroupModel, BundleModel } from '@core/domain/bundles/bundle.model';
import { BundleRepository } from '@core/repositories/bundle.repository';
import { AddBundleResponse } from '@presentation/pages/bundles/interfaces/add-bundle.interfaces';
import { Observable } from 'rxjs';
export class AddBundleUseCase implements UseCase<BundleGroupModel, AddBundleResponse> {
  constructor(private bundlesRepository: BundleRepository) {};
  execute(bundle: BundleGroupModel): Observable<AddBundleResponse> {
    return this.bundlesRepository.addBundle(bundle);
  }
}
