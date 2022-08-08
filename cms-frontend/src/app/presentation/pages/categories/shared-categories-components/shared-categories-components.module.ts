import { NgModule } from '@angular/core';
import { SharedModule } from '@presentation/shared/shared.module';
import { CategoryCardComponent } from './category-card/category-card.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddSubCategoryComponent } from './edit-category/add-sub-category/add-sub-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import {
  SubCategoryCardComponent,
} from './edit-category/sub-category-level/sub-category-card/sub-category-card.component';
import { SubCategoryLevelComponent } from './edit-category/sub-category-level/sub-category-level.component';
import { CommonModule } from '@angular/common';
const SHARED_COMPONENTS = [
  AddCategoryComponent,
  CategoryCardComponent,
  EditCategoryComponent,
  AddSubCategoryComponent,
  SubCategoryLevelComponent,
  SubCategoryCardComponent,
];
@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ...SHARED_COMPONENTS,
  ],
})
export class SharedCategoriesComponentsModule {
}
