import { InternalCategoryModel } from '@core/domain/internal-category.model';
import { createAction, props } from '@ngrx/store';
export const loadInternalCategoriesSuccess = createAction(
    '[InternalCategories] Load Success',
    props<{ internalCategories: InternalCategoryModel[] }>(),
);
export const loadInternalCategoriesFailure = createAction(
    '[InternalCategories] Load Fail',
    props<{ errorMessage: string }>(),
);
