import { UseCase } from '@core/base/use-case';
import { BundleGroupModel } from '@core/domain/bundles/bundle.model';
import { BundleRepository } from '@core/repositories/bundle.repository';
import { Observable } from 'rxjs';
export class GetBundleByIdUseCase implements UseCase<string, BundleGroupModel>{
    constructor(private bundleRepository: BundleRepository){ }
    execute(bundleId: string): Observable<BundleGroupModel> {
        return this.bundleRepository.getBundleById(bundleId);
    }
}
