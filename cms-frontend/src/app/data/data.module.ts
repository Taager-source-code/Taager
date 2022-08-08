import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserRepository } from '@core/repositories/user.repository';
import { UserLoginUseCase } from '@core/usecases/user-login.usecase';
import { UserWebRepository } from './repositories/user-web/user-web.repository';
import { CreateInternalCategoryUseCase } from '../core/usecases/internal-categories/create-internal-category.usecase';
import {
  CreateInternalSubCategoryUseCase,
} from '../core/usecases/internal-categories/create-internal-subcategory.usecase';
import {
  UpdateInternalCategoriesUseCase,
} from '../core/usecases/internal-categories/update-internal-category.usecase';
import {
  UpdateInternalSubCategoriesUseCase,
} from '../core/usecases/internal-categories/update-internal-subcategory.usecase';
import { DeleteInternalCategoryUseCase } from '../core/usecases/internal-categories/delete-internal-category.usecase';
import {
  DeleteInternalSubCategoryUseCase,
} from '../core/usecases/internal-categories/delete-internal-subcategory.usecase';
import { GetInternalCategoriesUseCase } from '../core/usecases/internal-categories/get-internal-categories.usecase';
import {
  GetInternalSubCategoriesUseCase,
} from '../core/usecases/internal-categories/get-internal-subcategories.usecase';
import { InternalCategoryRepository } from '../core/repositories/internal-category.repository';
import {
  InternalCategoryRepositoryImplementation,
} from './repositories/internal-category-implementation/internal-category-implementation.repository';
import { VariantGroupsRepository } from '@core/repositories/variant-groups.repository';
import { GetProductsUseCase } from '@core/usecases/variant-groups/get-products.usecase';
import {
  VariantGroupRepositoryImplementation,
 } from './repositories/variant-group-implementation/variant-group-implementation.repository';
import { AddProductUseCase } from '@core/usecases/variant-groups/add-product.usecase';
import { EditProductUseCase } from '@core/usecases/variant-groups/edit-product.usecase';
import { GetProductByIdUseCase } from '@core/usecases/variant-groups/get-product-by-id.usecase';
import { UploadImageUseCase } from '@core/usecases/utilities/upload-image.usecase';
import { CountryRepository } from '@core/repositories/country.repository';
import { CountryRepositoryImpl } from './repositories/country-implementation/country-impl.repository';
import { GetCountriesUseCase } from '@core/usecases/country/get-countries.usecase';
import {
  GetInternalSubCategoryByIdUseCase,
} from '@core/usecases/internal-categories/get-internal-sub-category-by-id.usecase';
import { UtilitiesRepository } from '@core/repositories/utilities.repository';
import {
  UtilitiesRepositoryImplementation,
} from './repositories/utilities-implementation/utilities-implementation.repository';
import { CommercialCategoryRepository } from '@core/repositories/commercial-category.repository';
import {
  CreateCommercialCategoryUseCase,
} from '@core/usecases/commercial-categories/create-commercial-category.usecase';
import {
  CreateCommercialSubCategoryUseCase,
} from '@core/usecases/commercial-categories/create-commercial-sub-category.usecase';
import {
  DeleteCommercialCategoryUseCase,
} from '@core/usecases/commercial-categories/delete-commercial-category.usecase';
import {
  DeleteCommercialSubCategoryUseCase,
} from '@core/usecases/commercial-categories/delete-commercial-sub-category.usecase';
import {
  ToggleFeaturedCommercialCategoryUseCase,
} from '@core/usecases/commercial-categories/featured-commercial-category-toggle-usecase';
import {
  GetCommercialCategoriesUseCase,
} from '@core/usecases/commercial-categories/get-commercial-categories.usecase';
import {
  GetCommercialSubCategoriesUseCase,
} from '@core/usecases/commercial-categories/get-commercial-sub-categories.usecase';
import {
  GetCommercialSubCategoryByIdUseCase,
} from '@core/usecases/commercial-categories/get-commercial-sub-category-by-id.usecase';
import {
  UpdateCommercialCategoryUseCase,
} from '@core/usecases/commercial-categories/update-commercial-category.usecase';
import {
  UpdateCommercialSubCategoryUseCase,
} from '@core/usecases/commercial-categories/update-commercial-sub-category.usecase';
import {
  CommercialCategoryImplementationRepository,
} from './repositories/commercial-category-implementation/commercial-category-implementation.repository';
import { GetUserUseCase } from '@core/usecases/user/get-user.usecase';
import { GetUserByTaagerIdUseCase } from '@core/usecases/user/get-user-by-taager-id.usecase';
import { GetCategoriesUseCase } from '@core/usecases/variant-groups/get-categories.usecase';
import { EventTrackingRepository } from '@core/repositories/event-tracking.repository';
import { TrackEventTrackingUseCase } from '@core/usecases/event-tracking/track-event-tracking.usecase';
import {
  EventTrackingRepositoryImpl,
 } from './repositories/event-tracking-implementation/event-tracking-impl.repository';
import { AddBundleUseCase } from '@core/usecases/bundles/add-bundle.usecase';
import { BundleRepository } from '@core/repositories/bundle.repository';
import { BundleRepositoryImplementation } from './repositories/bundles/bundle-repository.implementation';
import { GetBundlesUseCase } from '@core/usecases/bundles/get-bundles.usecase';
import { EditBundleUseCase } from '@core/usecases/bundles/edit-bundle.usecase';
import { GetBundleByIdUseCase } from '@core/usecases/bundles/get-bundle-by-id.usecase';
import { GetVariantUseCase } from '@core/usecases/bundles/get-variant-usecase';

const userLoginUseCaseFactory = (userRepo: UserRepository) => new UserLoginUseCase(userRepo);
export const userLoginUseCaseProvider = {
    provide: UserLoginUseCase,
    useFactory: userLoginUseCaseFactory,
    deps: [UserRepository],
};

const createInternalCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new CreateInternalCategoryUseCase(internalCategoryRepo);
export const createInternalCategoryUseCaseProvider = {
  provide: CreateInternalCategoryUseCase,
  useFactory: createInternalCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const createInternalSubCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new CreateInternalSubCategoryUseCase(internalCategoryRepo);
export const createInternalSubCategoryUseCaseProvider = {
  provide: CreateInternalSubCategoryUseCase,
  useFactory: createInternalSubCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const updateInternalCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new UpdateInternalCategoriesUseCase(internalCategoryRepo);
export const updateInternalCategoryUseCaseProvider = {
  provide: UpdateInternalCategoriesUseCase,
  useFactory: updateInternalCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const updateInternalSubCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new UpdateInternalSubCategoriesUseCase(internalCategoryRepo);
export const updateInternalSubCategoryUseCaseProvider = {
  provide: UpdateInternalSubCategoriesUseCase,
  useFactory: updateInternalSubCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const deleteInternalCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new DeleteInternalCategoryUseCase(internalCategoryRepo);
export const deleteInternalCategoryUseCaseProvider = {
  provide: DeleteInternalCategoryUseCase,
  useFactory: deleteInternalCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const deleteInternalSubCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new DeleteInternalSubCategoryUseCase(internalCategoryRepo);
export const deleteInternalSubCategoryUseCaseProvider = {
  provide: DeleteInternalSubCategoryUseCase,
  useFactory: deleteInternalSubCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const getInternalCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new GetInternalCategoriesUseCase(internalCategoryRepo);
export const getInternalCategoryUseCaseProvider = {
  provide: GetInternalCategoriesUseCase,
  useFactory: getInternalCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const getInternalSubCategoryUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new GetInternalSubCategoriesUseCase(internalCategoryRepo);
export const getInternalSubCategoryUseCaseProvider = {
  provide: GetInternalSubCategoriesUseCase,
  useFactory: getInternalSubCategoryUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const getInternalSubCategoryByIdUseCaseFactory =
  (internalCategoryRepo: InternalCategoryRepository) => new GetInternalSubCategoryByIdUseCase(internalCategoryRepo);
export const getInternalSubCategoryByIdUseCaseProvider = {
  provide: GetInternalSubCategoryByIdUseCase,
  useFactory: getInternalSubCategoryByIdUseCaseFactory,
  deps: [InternalCategoryRepository],
};

const getProductsUseCaseFactory =
  (variantGroupsRepository: VariantGroupsRepository) => new GetProductsUseCase(variantGroupsRepository);
export const getProductsUseCaseProvider = {
  provide: GetProductsUseCase,
  useFactory: getProductsUseCaseFactory,
  deps: [VariantGroupsRepository],
};

const getProductByIdUseCaseFactory =
  (variantGroupsRepository: VariantGroupsRepository) => new GetProductByIdUseCase(variantGroupsRepository);
export const getProductByIdUseCaseProvider = {
  provide: GetProductByIdUseCase,
  useFactory: getProductByIdUseCaseFactory,
  deps: [VariantGroupsRepository],
};

const uploadImageUseCaseFactory =
  (utilitiesRepository: UtilitiesRepository) => new UploadImageUseCase(utilitiesRepository);
export const uploadImageUseCaseProvider = {
  provide: UploadImageUseCase,
  useFactory: uploadImageUseCaseFactory,
  deps: [UtilitiesRepository],
};

const addProductUseCaseFactory =
  (variantGroupsRepository: VariantGroupsRepository) => new AddProductUseCase(variantGroupsRepository);
export const addProductUseCaseProvider = {
  provide: AddProductUseCase,
  useFactory: addProductUseCaseFactory,
  deps: [VariantGroupsRepository],
};

const editProductUseCaseFactory =
  (variantGroupsRepository: VariantGroupsRepository) => new EditProductUseCase(variantGroupsRepository);
export const editProductUseCaseProvider = {
  provide: EditProductUseCase,
  useFactory: editProductUseCaseFactory,
  deps: [VariantGroupsRepository],
};

const getCountriesUseCaseFactory =
  (countryRepository: CountryRepository) => new GetCountriesUseCase(countryRepository);
export const getCountriesUseCaseProvider = {
  provide: GetCountriesUseCase,
  useFactory: getCountriesUseCaseFactory,
  deps: [CountryRepository],
};

const createCommercialCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new CreateCommercialCategoryUseCase(
    commercialCategoryRepository,
  );
export const createCommercialCategoryUseCaseProvider = {
  provide: CreateCommercialCategoryUseCase,
  useFactory: createCommercialCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const createCommercialSubCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new CreateCommercialSubCategoryUseCase(
    commercialCategoryRepository,
  );
export const createCommercialSubCategoryUseCaseProvider = {
  provide: CreateCommercialSubCategoryUseCase,
  useFactory: createCommercialSubCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const deleteCommercialCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new DeleteCommercialCategoryUseCase(
    commercialCategoryRepository,
  );
export const deleteCommercialCategoryUseCaseProvider = {
  provide: DeleteCommercialCategoryUseCase,
  useFactory: deleteCommercialCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const deleteCommercialSubCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new DeleteCommercialSubCategoryUseCase(
    commercialCategoryRepository,
  );
export const deleteCommercialSubCategoryUseCaseProvider = {
  provide: DeleteCommercialSubCategoryUseCase,
  useFactory: deleteCommercialSubCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const toggleFeaturedCommercialCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new ToggleFeaturedCommercialCategoryUseCase(
    commercialCategoryRepository,
  );
export const toggleFeaturedCommercialCategoryUseCaseProvider = {
  provide: ToggleFeaturedCommercialCategoryUseCase,
  useFactory: toggleFeaturedCommercialCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const getCommercialCategoriesUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new GetCommercialCategoriesUseCase(
    commercialCategoryRepository,
  );
export const getCommercialCategoriesUseCaseProvider = {
  provide: GetCommercialCategoriesUseCase,
  useFactory: getCommercialCategoriesUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const getCommercialSubCategoriesUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new GetCommercialSubCategoriesUseCase(
    commercialCategoryRepository,
  );
export const getCommercialSubCategoriesUseCaseProvider = {
  provide: GetCommercialSubCategoriesUseCase,
  useFactory: getCommercialSubCategoriesUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const getCommercialSubCategoryByIdUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new GetCommercialSubCategoryByIdUseCase(
    commercialCategoryRepository,
  );
export const getCommercialSubCategoryByIdUseCaseProvider = {
  provide: GetCommercialSubCategoryByIdUseCase,
  useFactory: getCommercialSubCategoryByIdUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const updateCommercialCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new UpdateCommercialCategoryUseCase(
    commercialCategoryRepository,
  );
export const updateCommercialCategoryUseCaseProvider = {
  provide: UpdateCommercialCategoryUseCase,
  useFactory: updateCommercialCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const updateCommercialSubCategoryUseCaseFactory =
  (commercialCategoryRepository: CommercialCategoryRepository) => new UpdateCommercialSubCategoryUseCase(
    commercialCategoryRepository,
  );
export const updateCommercialSubCategoryUseCaseProvider = {
  provide: UpdateCommercialSubCategoryUseCase,
  useFactory: updateCommercialSubCategoryUseCaseFactory,
  deps: [CommercialCategoryRepository],
};

const getUserUseCaseFactory =
  (userRepository: UserRepository) => new GetUserUseCase(userRepository);
export const getUserUseCaseProvider = {
  provide: GetUserUseCase,
  useFactory: getUserUseCaseFactory,
  deps: [UserRepository],
};

const getUserByTaagerIdUseCaseFactory =
  (userRepository: UserRepository) => new GetUserByTaagerIdUseCase(userRepository);
export const getUserByTaagerIdUseCaseProvider = {
  provide: GetUserByTaagerIdUseCase,
  useFactory: getUserByTaagerIdUseCaseFactory,
  deps: [UserRepository],
};

const getCategoriesUseCaseFactory =
  (variantGroupsRepository: VariantGroupsRepository) => new GetCategoriesUseCase(variantGroupsRepository);
export const getCategoriesUseCaseProvider = {
  provide: GetCategoriesUseCase,
  useFactory: getCategoriesUseCaseFactory,
  deps: [VariantGroupsRepository],
};

const trackEventTrackingUseCaseFactory = (eventTrackingRepo: EventTrackingRepository) =>
    new TrackEventTrackingUseCase(eventTrackingRepo);
export const trackEventTrackingUseCaseProvider = {
    provide: TrackEventTrackingUseCase,
    useFactory: trackEventTrackingUseCaseFactory,
    deps: [EventTrackingRepository],
};

const addBundleUseCaseFactory = (
  bundleRepository: BundleRepository,
) => new AddBundleUseCase(bundleRepository);
export const addBundleUseCaseProvider = {
  provide: AddBundleUseCase,
  useFactory: addBundleUseCaseFactory,
  deps: [
    BundleRepository,
  ],
};

const getBundlesUseCaseFactory = (
  bundleRepository: BundleRepository,
) => new GetBundlesUseCase(bundleRepository);
export const getBundlesUseCaseProvider = {
  provide: GetBundlesUseCase,
  useFactory: getBundlesUseCaseFactory,
  deps: [
    BundleRepository,
  ],
};

const editBundleUseCaseFactory =
  (bundleRepository: BundleRepository) => new EditBundleUseCase(bundleRepository);
export const editBundleUseCaseProvider = {
  provide: EditBundleUseCase,
  useFactory: editBundleUseCaseFactory,
  deps: [BundleRepository],
};

const getBundleUseCaseFactory = (
  bundleRepository: BundleRepository,
) => new GetBundleByIdUseCase(bundleRepository);
export const getBundleUseCaseProvider = {
  provide: GetBundleByIdUseCase,
  useFactory: getBundleUseCaseFactory,
  deps: [
    BundleRepository,
  ],
};

const getVariantUseCaseFactory = (
  bundleRepository: BundleRepository,
) => new GetVariantUseCase(bundleRepository);
export const getVariantUseCaseProvider = {
  provide: GetVariantUseCase,
  useFactory: getVariantUseCaseFactory,
  deps: [
    BundleRepository,
  ],
};

@NgModule({
  providers: [
    userLoginUseCaseProvider,
    getUserUseCaseProvider,
    getUserByTaagerIdUseCaseProvider,
    { provide: UserRepository, useClass: UserWebRepository },
    createInternalCategoryUseCaseProvider,
    createInternalSubCategoryUseCaseProvider,
    updateInternalCategoryUseCaseProvider,
    updateInternalSubCategoryUseCaseProvider,
    deleteInternalCategoryUseCaseProvider,
    deleteInternalSubCategoryUseCaseProvider,
    getInternalCategoryUseCaseProvider,
    getInternalSubCategoryUseCaseProvider,
    getInternalSubCategoryByIdUseCaseProvider,
    getProductsUseCaseProvider,
    getProductByIdUseCaseProvider,
    uploadImageUseCaseProvider,
    addProductUseCaseProvider,
    editProductUseCaseProvider,
    getCountriesUseCaseProvider,
    createCommercialCategoryUseCaseProvider,
    createCommercialSubCategoryUseCaseProvider,
    deleteCommercialCategoryUseCaseProvider,
    deleteCommercialSubCategoryUseCaseProvider,
    toggleFeaturedCommercialCategoryUseCaseProvider,
    getCommercialCategoriesUseCaseProvider,
    getCommercialSubCategoriesUseCaseProvider,
    getCommercialSubCategoryByIdUseCaseProvider,
    updateCommercialCategoryUseCaseProvider,
    updateCommercialSubCategoryUseCaseProvider,
    getCategoriesUseCaseProvider,
    trackEventTrackingUseCaseProvider,
    addBundleUseCaseProvider,
    getBundlesUseCaseProvider,
    editBundleUseCaseProvider,
    getBundleUseCaseProvider,
    getVariantUseCaseProvider,
    { provide: InternalCategoryRepository, useClass: InternalCategoryRepositoryImplementation },
    { provide: VariantGroupsRepository, useClass: VariantGroupRepositoryImplementation },
    { provide: CountryRepository, useClass: CountryRepositoryImpl },
    { provide: UtilitiesRepository, useClass: UtilitiesRepositoryImplementation },
    { provide: CommercialCategoryRepository, useClass: CommercialCategoryImplementationRepository},
    { provide: EventTrackingRepository, useClass: EventTrackingRepositoryImpl },
    { provide: BundleRepository, useClass: BundleRepositoryImplementation },
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
})
export class DataModule { }
