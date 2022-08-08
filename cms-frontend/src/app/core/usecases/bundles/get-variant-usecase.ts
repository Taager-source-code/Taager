import { UseCase } from '@core/base/use-case';
import { VariantModel } from '@core/domain/variant-group.model';
import { BundleRepository } from '@core/repositories/bundle.repository';
import { Observable } from 'rxjs';
export class GetVariantUseCase implements UseCase<{sku: string; country: string}, VariantModel> {
    constructor(
        private _bundleRepository: BundleRepository,
    ) {}
    execute(
        params: { sku: string; country: string },
    ): Observable<VariantModel> {
        return this._bundleRepository.getVariantByProductSKU(
            params.sku, params.country,
        );
    }
};
