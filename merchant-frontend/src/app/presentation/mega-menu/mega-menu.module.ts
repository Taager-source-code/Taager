import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryListItemComponent } from './category-list/category-list-item/category-list-item.component';
import { SubcategoriesListComponent } from './subcategories-list/subcategories-list.component';
import { MegaMenuComponent } from './mega-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';


const COMPONENTS = [
  MegaMenuComponent,
  CategoryListComponent,
  CategoryListItemComponent,
  SubcategoriesListComponent,
];
@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class MegaMenuModule { }


