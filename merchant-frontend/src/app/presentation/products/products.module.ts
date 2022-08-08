import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsV2Component } from './products-v2/products-v2.component';
import { CategoryProductsComponent } from './category-products/category-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CatalogComponent } from './catalog/catalog.component';
import { InvalidCategoryComponent } from './invalid-category/invalid-category.component';
import { NoSearchResultsComponent } from './no-search-results/no-search-results.component';

const routes: Routes = [
  { path: '', component: ProductsV2Component },
  { path: 'category', component: CategoryProductsComponent},
  { path: 'category/:id', component: CategoryProductsComponent},
  { path: 'catalog', component: CatalogComponent},
  { path: 'invalid-category', component: InvalidCategoryComponent},
  { path: 'no-search-results', component: NoSearchResultsComponent},
  { path: ':id', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}


