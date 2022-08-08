import { UseCase } from '@core/base/use-case';
import { BundleGroupModel } from '@core/domain/bundles/bundle.model';
import { BundleRepository } from '@core/repositories/bundle.repository';
import { Observable } from 'rxjs';
export class EditBundleUseCase implements UseCase<BundleGroupModel,void>{
    constructor(private bundleRepository: BundleRepository){ }
    execute(bundle: BundleGroupModel): Observable<void> {
        return this.bundleRepository.editBundle(bundle);
    }
}
