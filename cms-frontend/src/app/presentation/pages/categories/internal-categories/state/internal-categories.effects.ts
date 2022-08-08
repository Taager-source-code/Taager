import { Injectable } from '@angular/core';
import { InternalCategoryModel } from '@core/domain/internal-category.model';
import { GetInternalCategoriesUseCase } from '@core/usecases/internal-categories/get-internal-categories.usecase';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { InternalCategoriesViewActions, InternalCategoriesDomainActions } from './actions';
@Injectable()
export class InternalCategoriesEffects {
    loadInternalCategories$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(InternalCategoriesViewActions.loadInternalCategories),
                mergeMap(() => this.getInternalCategoriesUseCase.execute()
                    .pipe(
                        map((internalCategories: InternalCategoryModel[]) =>
                        InternalCategoriesDomainActions.loadInternalCategoriesSuccess({ internalCategories })),
                        catchError(err => {
                            const errorMessage: string = err.error.description;
                            return of(InternalCategoriesDomainActions.loadInternalCategoriesFailure({ errorMessage }));
                        }),
                    )),
            ),
    );
    constructor(
        private actions$: Actions,
        private getInternalCategoriesUseCase: GetInternalCategoriesUseCase,
    ) { }
}
