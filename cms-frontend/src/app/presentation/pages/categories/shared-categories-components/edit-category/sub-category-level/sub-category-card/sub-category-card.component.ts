import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SubCategoryModel } from '@presentation/@core/interfaces/categories.interface';
@Component({
  selector: 'ngx-sub-category-card',
  templateUrl: './sub-category-card.component.html',
  styleUrls: ['./sub-category-card.component.scss'],
})
export class SubCategoryCardComponent implements OnInit {
  @Input() cardIndex: number;
  @Input() subCategory: SubCategoryModel;
  @Input() selectedCategoryId: string;
  @Output() deleteSubCategoryClicked = new EventEmitter<string>();
  @Output() editSubCategoryConfirmed = new EventEmitter<SubCategoryModel>();
  @Output() subCategorySelected = new EventEmitter<SubCategoryModel>();
  @ViewChild('englishNameSubCategory') englishNameSubCategory: ElementRef;
  @ViewChild('arabicNameSubCategory')  arabicNameSubCategory: ElementRef;
  @ViewChild('subCategoryEditButton')  subCategoryEditButton: ElementRef;
  public editSubCategoryEnabled = false;
  public deleteSubCategory = false;
  public editInputFields: FormGroup;
  constructor() { }
  @HostListener('window:click', ['$event'])
  outClick(clickedLocation) {
    try {
      if(!clickedLocation.composedPath()?.includes(this.englishNameSubCategory?.nativeElement)  &&
        !clickedLocation.composedPath()?.includes(this.arabicNameSubCategory?.nativeElement)  &&
        !clickedLocation.composedPath()?.includes(this.subCategoryEditButton?.nativeElement)) {
          this.editSubCategoryEnabled = false;
        }
    } catch (error) { }
  }
  ngOnInit(): void {
    this.editInputFields = new FormGroup({
      englishName : new FormControl(this.subCategory.name.englishName),
      arabicName : new FormControl(this.subCategory.name.arabicName),
    });
  }
  onSelectSubCategory(): void {
    if(this.subCategory.id !== this.selectedCategoryId) {
      this.subCategorySelected.emit(this.subCategory);
    }
  }
  onEditSubCategory(): void {
    this.editInputFields.get('englishName').setValue(this.subCategory.name.englishName);
    this.editInputFields.get('arabicName').setValue(this.subCategory.name.arabicName);
    this.editSubCategoryEnabled = true;
  }
  onUpdateSubCategories(): void {
    this.editSubCategoryConfirmed.emit({
      ...this.subCategory,
      name: {
        englishName: this.editInputFields.value.englishName,
        arabicName: this.editInputFields.value.arabicName,
      },
    });
    this.editSubCategoryEnabled = false;
  }
  closeEdit(): void {
    this.editSubCategoryEnabled = false;
  }
  handleKeyUp(e): void {
    if(e.keyCode === 27){
      this.closeEdit();
    } else if(e.keyCode === 13 && this.editInputFields.value.englishName && this.editInputFields.value.arabicName) {
      this.onUpdateSubCategories();
    }
 }
 onDelete(): void {
   if (confirm('Are you sure you want to delete this sub category?')) {
     this.deleteSubCategoryClicked.emit(this.subCategory.id);
   }
  }
}
