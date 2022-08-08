import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalCategoriesComponent } from './internal-categories.component';
import {
    NbCardModule, NbIconModule, NbSpinnerModule,
} from '@nebular/theme';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { SharedCategoriesComponentsModule } from '../shared-categories-components/shared-categories-components.module';
import { SharedModule } from '@presentation/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { internalCategoriesReducer } from './state/internal-categories.reducer';
import { EffectsModule } from '@ngrx/effects';
import { InternalCategoriesEffects } from './state/internal-categories.effects';
import { EditInternalCategoriesComponent } from './edit-internal-categories/edit-internal-categories.component';
const COMPONENTS = [
    InternalCategoriesComponent,
    EditInternalCategoriesComponent,
];
@NgModule({
    declarations: [
        ...COMPONENTS,
    ],
    imports: [
        CommonModule,
        NbCardModule,
        NbIconModule,
        NbSpinnerModule,
        ToastModule,
        SharedModule,
        SharedCategoriesComponentsModule,
        StoreModule.forFeature('InternalCategories',  internalCategoriesReducer),
        EffectsModule.forFeature([InternalCategoriesEffects]),
    ],
    exports: [
        ...COMPONENTS,
    ],
})
export class InternalCategoriesModule { }
