import { Component, Input, OnInit } from '@angular/core';

import { CommercialCategoryTreeNode } from 'src/app/presentation/shared/interfaces/commercial-categories.interface';

import { environment } from 'src/environments/environment';

@Component({

  selector: 'app-category-list-item',

  templateUrl: './category-list-item.component.html',

  styleUrls: ['./category-list-item.component.scss']

})

export class CategoryListItemComponent implements OnInit {

  @Input() categoryNode: CommercialCategoryTreeNode;

  @Input() hoveredCategoryId: string;

  public iconsBaseUrl = '';

  constructor() { }

  ngOnInit(): void {

    this.iconsBaseUrl = environment.IMAGES_BUCKET_URL;

  }

}
