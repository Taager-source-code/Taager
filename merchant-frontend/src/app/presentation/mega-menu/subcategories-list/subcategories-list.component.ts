import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommercialCategoryTreeNode } from '../../shared/interfaces/commercial-categories.interface';
import { CommercialCategoriesService } from '../../shared/services/commercial-categories.service';
import { sortByAttribute } from '../../shared/utilities/sort-by-attribute.utility';

@Component({
  selector: 'app-subcategories-list',
  templateUrl: './subcategories-list.component.html',
  styleUrls: ['./subcategories-list.component.scss'],
  providers: [CommercialCategoriesService]
})
export class SubcategoriesListComponent implements OnInit, OnChanges {
  @Input() hoveredCategoryId: string;
  commercialSubCategoriesList: CommercialCategoryTreeNode[];

  constructor(
    private commercialCategoriesService: CommercialCategoriesService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.commercialCategoriesService.getCommercialCategoriesTree().subscribe(commercialCategoriesTree => {
      const commercialSubCategoriesNodesList = commercialCategoriesTree.root.children;
      const hoveredCategory = commercialSubCategoriesNodesList.filter(category => category.key === this.hoveredCategoryId)[0];
      this.commercialSubCategoriesList = hoveredCategory.children.sort(
        (categoryOne, categoryTwo) => sortByAttribute(categoryOne.children, categoryTwo.children, 'length')
      ) || [];
    });
  }

}


