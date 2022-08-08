import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralProductAttributesComponent } from './general-product-attributes/general-product-attributes.component';
import { ProductInfoComponent } from './general-product-attributes/product-info/product-info.component';
import { ProductMediaComponent } from './general-product-attributes/product-media/product-media.component';
import { ProductVariantsComponent } from './general-product-attributes/product-variants/product-variants.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import {
  ProductInternalCategoryComponent,
} from './product-categories/product-internal-category/product-internal-category.component';
import { ProductDialogComponent } from './product-dialog.component';
import { ProductSpecificationComponent } from './product-specification/product-specification.component';
import {
  NbCardModule,
  NbSelectModule,
  NbSpinnerModule,
  NbToggleModule,
  NbCheckboxModule,
  NbIconModule,
  NbRadioModule,
} from '@nebular/theme';
import {
  ImageCarouselComponent,
} from './general-product-attributes/product-media/image-carousel/image-carousel.component';
import { SharedModule } from '@presentation/shared/shared.module';
import {
  ProductCommercialCategoriesComponent,
 } from './product-categories/product-commercial-categories/product-commercial-categories.component';
/* eslint-disable max-len */
import {ProductCommercialCategoryCardComponent } from './product-categories/product-commercial-categories/product-commercial-category-card/product-commercial-category-card.component';
const COMPONENTS = [
  ProductDialogComponent,
  GeneralProductAttributesComponent,
  ProductCategoriesComponent,
  ProductSpecificationComponent,
  ProductInfoComponent,
  ProductMediaComponent,
  ProductVariantsComponent,
  ProductCommercialCategoriesComponent,
  ProductCommercialCategoryCardComponent,
  ProductInternalCategoryComponent,
  ImageCarouselComponent,
];
@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NbCardModule,
    NbSelectModule,
    NbToggleModule,
    NbIconModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbRadioModule,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class ProductDialogModule { }
