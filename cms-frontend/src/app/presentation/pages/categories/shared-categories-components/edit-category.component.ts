import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryTypes } from '@presentation/@core/contstants/categories';
import {
  CategoryModel, SubCategoryLevel, SubCategoryModel,
} from '@presentation/@core/interfaces/categories.interface';
@Component({
  selector: 'ngx-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
  @Input() editedCategory: CategoryModel;
  @Input() subCategoryLevels: SubCategoryLevel[];
  @Input() categoryType: CategoryTypes;
  @Output() navigateBack = new EventEmitter<void>();
  @Output() confirmEditCategoryEmitter = new EventEmitter<CategoryModel>();
  @Output() selectedSubCategoryChangedEmitter =
    new EventEmitter<{subCategory: CategoryModel | SubCategoryModel; level: number}>();
  @Output() getSubCategoryLevelListEmitter = new EventEmitter<number>();
  @Output() editSubCategoryEmitter = new EventEmitter<{subCategory: SubCategoryModel; level: number}>();
  @Output() subCategoryDeleteClickedEmitter = new EventEmitter<{subCategoryId: string; level: number}>();
  categoryForm: FormGroup;
  constructor( ) { }
  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      englishName: new FormControl(this.editedCategory.name.englishName, Validators.required),
      arabicName: new FormControl(this.editedCategory.name.arabicName, Validators.required),
    });
  }
  onClickBackButton(): void {
    this.navigateBack.emit();
  }
  onCancelEditCategory(): void {
    this.categoryForm.get('englishName').setValue(this.editedCategory.name.englishName);
    this.categoryForm.get('arabicName').setValue(this.editedCategory.name.arabicName);
  }
  onConfirmEditCategory(): void {
    const updatedCategory = {
      ...this.editedCategory,
      name: {
        arabicName: this.categoryForm.value.arabicName,
        englishName: this.categoryForm.value.englishName,
      },
    };
    this.confirmEditCategoryEmitter.emit(updatedCategory);
  }
  onSelectedSubCategoryChanged(subCategory: CategoryModel | SubCategoryModel, level: number): void {
    this.selectedSubCategoryChangedEmitter.emit({subCategory, level});
  }
  getSubCategoryLevelList(level: number): void {
    this.getSubCategoryLevelListEmitter.emit(level);
  }
  onEditSubCategory(subCategory: SubCategoryModel, level: number): void {
    this.editSubCategoryEmitter.emit({subCategory, level});
  }
  onSubCategoryDeleteClicked(subCategoryId: string, level: number): void {
    this.subCategoryDeleteClickedEmitter.emit({subCategoryId, level});
  }
}
