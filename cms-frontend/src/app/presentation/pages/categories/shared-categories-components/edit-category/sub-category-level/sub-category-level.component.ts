import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddSubCategoryComponent } from '../add-sub-category/add-sub-category.component';
import { CategoryTypes } from '@presentation/@core/contstants/categories';
import { CategoryModel, SubCategoryModel } from '@presentation/@core/interfaces/categories.interface';
@Component({
  selector: 'ngx-sub-category-level',
  templateUrl: './sub-category-level.component.html',
  styleUrls: ['./sub-category-level.component.scss'],
})
export class SubCategoryLevelComponent implements OnInit {
  @Input() levelNumber: number;
  @Input() parentCategory: CategoryModel | SubCategoryModel;
  @Input() levelSubCategories: SubCategoryModel[];
  @Input() selectedSubCategoryId: string;
  @Input() loading = false;
  @Input() categoryType: CategoryTypes;
  @Output() reloadSubCategoryLevel = new EventEmitter<void>();
  @Output() selectedSubCategoryChanged = new EventEmitter<SubCategoryModel>();
  @Output() subCategoryEditClicked = new EventEmitter<SubCategoryModel>();
  @Output() subCategoryDeleteClicked = new EventEmitter<string>();
  constructor(
    private dialogService: NbDialogService,
  ) { }
  ngOnInit(): void { }
  onClickAddNew(): void {
    this.dialogService.open(AddSubCategoryComponent, {
      context: {
        parentCategory: this.parentCategory,
        categoryType: this.categoryType,
      },
    }).onClose.subscribe(reload => {
      if(reload) {
        this.reloadSubCategoryLevel.emit();
      }
    });
  }
  onSubCategorySelect(category: SubCategoryModel): void {
    this.selectedSubCategoryChanged.emit(category);
  }
  onSubCategoryDelete(categoryId: string): void {
    this.subCategoryDeleteClicked.emit(categoryId);
  }
  onSubCategoryEdit(category: SubCategoryModel): void {
    this.subCategoryEditClicked.emit(category);
  }
}
