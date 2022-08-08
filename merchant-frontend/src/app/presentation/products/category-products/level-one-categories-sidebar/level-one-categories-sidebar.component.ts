import { Component, Input, OnInit } from '@angular/core';
import { CommercialCategoryTreeNode } from 'src/app/presentation/shared/interfaces/commercial-categories.interface';
import { CategoryInterface } from 'src/app/presentation/shared/interfaces/product.interafce';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-level-one-categories-sidebar',
  templateUrl: './level-one-categories-sidebar.component.html',
  styleUrls: ['./level-one-categories-sidebar.component.scss']
})
export class LevelOneCategoriesSidebarComponent implements OnInit {
  @Input() categoriesNodes: CommercialCategoryTreeNode[];
  @Input() nonCommercialCategories: CategoryInterface[];
  @Input() selectedCategory: string;
  @Input() queryParamsObject;
  public iconsBaseUrl;

  constructor() { }

  ngOnInit(): void {
    this.iconsBaseUrl = environment.IMAGES_BUCKET_URL;
  }

}


