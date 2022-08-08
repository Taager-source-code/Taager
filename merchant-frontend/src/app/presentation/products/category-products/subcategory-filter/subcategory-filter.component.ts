import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommercialCategoryTreeNode } from 'src/app/presentation/shared/interfaces/commercial-categories.interface';

@Component({
  selector: 'app-subcategory-filter',
  templateUrl: './subcategory-filter.component.html',
  styleUrls: ['./subcategory-filter.component.scss']
})
export class SubcategoryFilterComponent implements OnInit, OnChanges {

  @Input() fourthLevelCategoriesList: CommercialCategoryTreeNode[];
  public allCategoriesName = {
    arabicName: 'Ø§Ù„ÙƒÙ„',
    englishName: 'all'
  };

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    const allFourthLevelCategoriesNode: CommercialCategoryTreeNode = {
      key: this.fourthLevelCategoriesList[0].parent.key,
      value: {
        name: this.allCategoriesName,
        featured: false,
        icon: ''
      },
      parent: this.fourthLevelCategoriesList[0].parent,
      children: [],
      isLeaf: true,
      hasChildren: false,
    };
    const fourthLevelCategoriesListName = this.fourthLevelCategoriesList.map(
      category => category.value.name.arabicName
    );
    if (!fourthLevelCategoriesListName.includes(this.allCategoriesName.arabicName)) {
      this.fourthLevelCategoriesList = [allFourthLevelCategoriesNode, ...this.fourthLevelCategoriesList];
    }
  }

}


