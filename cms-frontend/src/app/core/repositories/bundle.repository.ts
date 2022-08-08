import { BundleFilterModel, PaginatedBundleList } from '@core/domain/bundles/bundle-filter.model';
import { BundleGroupModel } from '@core/domain/bundles/bundle.model';
import { VariantModel } from '@core/domain/variant-group.model';
import { AddBundleResponse } from '@presentation/pages/bundles/interfaces/add-bundle.interfaces';
import { Observable } from 'rxjs';
export abstract class BundleRepository {
    abstract getBundles(filters: BundleFilterModel): Observable<PaginatedBundleList>;
    abstract addBundle(bundle: BundleGroupModel): Observable<AddBundleResponse>;
    abstract editBundle(bundle: BundleGroupModel): Observable<void>;
    abstract getBundleById(bundleId: string): Observable<BundleGroupModel>;
    abstract getVariantByProductSKU(sku: string, country: string): Observable<VariantModel>;
}
