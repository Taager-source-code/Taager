import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { SharedCategoriesComponentsModule } from '../shared-categories-components/shared-categories-components.module';
import { SharedModule } from '@presentation/shared/shared.module';
import { CommercialCategoriesComponent } from './commercial-categories.component';
import { EditCommercialCategoriesComponent } from './edit-commercial-categories/edit-commercial-categories.component';
const COMPONENTS = [
  CommercialCategoriesComponent,
  EditCommercialCategoriesComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbSpinnerModule,
    ToastModule,
    SharedModule,
    SharedCategoriesComponentsModule,
  ],
  exports: [...COMPONENTS],
})
export class CommercialCategoriesModule {}
