import { InternalCategoryModel } from '@core/domain/internal-category.model';
import {
    on,
    createReducer,
    createFeatureSelector,
    createSelector,
} from '@ngrx/store';
import { InternalCategoriesDomainActions } from './actions';
export interface InternalCategoriesState {
    internalCategoriesList: InternalCategoryModel[];
    errorMessage: string;
    isLoading: boolean;
};
const initialState: InternalCategoriesState = {
    internalCategoriesList: [],
    errorMessage: '',
    isLoading: true,
};
const selectInternalCategoryFeatureState = createFeatureSelector<InternalCategoriesState>('InternalCategories');
export const selectInternalCategoriesList = createSelector(
    selectInternalCategoryFeatureState,
    state => state.internalCategoriesList,
);
export const selectselectInternalCategoriesErrorMessage = createSelector(
    selectInternalCategoryFeatureState,
    state => state.errorMessage,
);
export const selectLoading = createSelector(
    selectInternalCategoryFeatureState,
    state => state.isLoading,
);
export const internalCategoriesReducer = createReducer<InternalCategoriesState>(
    initialState,
    on(
        InternalCategoriesDomainActions.loadInternalCategoriesSuccess,
        (state, action): InternalCategoriesState => ({
            ...state,
            internalCategoriesList: action.internalCategories,
            isLoading: false,
        })),
    on(
        InternalCategoriesDomainActions.loadInternalCategoriesFailure,
        (state, action): InternalCategoriesState => ({
            ...state,
            errorMessage: action.errorMessage,
            isLoading: false,
        })),
);