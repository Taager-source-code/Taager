import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommercialCategoryTreeNode } from '../../shared/interfaces/commercial-categories.interface';
import { CommercialCategoriesService } from '../../shared/services/commercial-categories.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [CommercialCategoriesService]
})
export class CategoryListComponent implements OnInit {
  @Output() categoryHoveredEmitter = new EventEmitter<string>();
  categoriesNodes: CommercialCategoryTreeNode[];
  hoveredCategoryId;
  constructor(
    private commercialCategoriesService: CommercialCategoriesService,
  ) { }

  ngOnInit(): void {
    this.commercialCategoriesService.getCommercialCategoriesTree().subscribe(commercialCategoriesTree => {
      if(commercialCategoriesTree) {
        this.categoriesNodes = commercialCategoriesTree.root.children;
      }
    });
  }

  onCategoryHovered(categoryId: string): void {
    this.hoveredCategoryId = categoryId;
    this.categoryHoveredEmitter.emit(categoryId);
  }
}


