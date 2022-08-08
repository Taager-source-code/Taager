import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { IvyCarouselModule } from 'angular-responsive-carousel';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from 'src/app/presentation/shared/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ProductsRoutingModule } from './products-routing.module';

import { ProductsV2Component } from './products-v2/products-v2.component';
import { CategoryCardComponent } from './products-v2/category-card/category-card.component';
import { ProductCardComponent } from './products-v2/product-card/product-card.component';
import { TopBannerComponent } from './products-v2/top-banner/top-banner.component';
import { SubBannerComponent } from './products-v2/sub-banner/sub-banner.component';
import { ProductsCarouselComponent } from './products-v2/products-carousel/products-carousel.component';
import { CategoryProductsComponent } from './category-products/category-products.component';
import { CategoriesSidebarComponent } from './category-products/categories-sidebar/categories-sidebar.component';
import { MiniProductCardComponent } from './category-products/mini-product-card/mini-product-card.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CatalogComponent } from './catalog/catalog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WebComponentsModule } from '@taager-webapp/web-components';
import {
  RequestUnavailableProductComponent
} from './no-search-results/request-unavailable-product/request-unavailable-product.component';
import {
  RequestUnavailableProductDialogComponent
} from './no-search-results/request-unavailable-product/request-unavailable-product-dialog/request-unavailable-product-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SubcategoryFilterComponent } from './category-products/subcategory-filter/subcategory-filter.component';
import { InvalidCategoryComponent } from './invalid-category/invalid-category.component';
import { NoSearchResultsComponent } from './no-search-results/no-search-results.component';
import {
  LevelOneCategoriesSidebarComponent
} from './category-products/level-one-categories-sidebar/level-one-categories-sidebar.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ProductsV2Component,
    CategoryCardComponent,
    ProductCardComponent,
    TopBannerComponent,
    SubBannerComponent,
    ProductsCarouselComponent,
    CategoryProductsComponent,
    CategoriesSidebarComponent,
    MiniProductCardComponent,
    ProductDetailsComponent,
    CatalogComponent,
    RequestUnavailableProductComponent,
    RequestUnavailableProductDialogComponent,
    SubcategoryFilterComponent,
    InvalidCategoryComponent,
    NoSearchResultsComponent,
    LevelOneCategoriesSidebarComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    IvyCarouselModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    WebComponentsModule,
    MatDialogModule,
    MatChipsModule,
  ],
})
export class ProductsModule { }


