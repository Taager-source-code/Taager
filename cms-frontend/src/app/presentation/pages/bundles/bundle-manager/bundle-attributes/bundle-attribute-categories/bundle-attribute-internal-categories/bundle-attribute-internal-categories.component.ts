import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InternalCategoryModel } from '@core/domain/internal-category.model';
import { GetInternalCategoriesUseCase } from '@core/usecases/internal-categories/get-internal-categories.usecase';
import {
  GetInternalSubCategoryByIdUseCase,
} from '@core/usecases/internal-categories/get-internal-sub-category-by-id.usecase';
import { GetInternalSubCategoriesUseCase } from '@core/usecases/internal-categories/get-internal-subcategories.usecase';
import { forkJoin, Subject } from 'rxjs';
@Component({
  selector: 'ngx-bundle-attribute-internal-categories',
  templateUrl: './bundle-attribute-internal-categories.component.html',
  styleUrls: ['./bundle-attribute-internal-categories.component.scss'],
})
export class BundleAttributeInternalCategoriesComponent implements OnInit, OnDestroy {
  @Output() emitBundleAttributesInternalCategoriesForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() initialData: string;
  @Input() showFormErrors$: Subject<boolean> = new Subject<boolean>();
  isLoading = false;
  levelOneInternalCategoriesList: InternalCategoryModel[] = [];
  levelTwoInternalCategoriesList: InternalCategoryModel[] = [];
  levelThreeInternalCategoriesList: InternalCategoryModel[] = [];
  savedLevelOneId: string;
  savedLevelTwoId: string;
  internalCategoriesFormGroup: FormGroup = new FormGroup({
    internalCategoryLevelOne: new FormControl('', [Validators.required]),
    internalCategoryLevelTwo: new FormControl('', [Validators.required]),
    internalCategoryLevelThree: new FormControl('', [Validators.required]),
  });
  constructor(
    private getInternalCategoriesUseCase: GetInternalCategoriesUseCase,
    private getInternalSubCategoriesUseCase: GetInternalSubCategoriesUseCase,
    private getInternalSubCategoryByIdUseCase: GetInternalSubCategoryByIdUseCase,
  ) {}
  ngOnInit(): void {
    this.getFirstLevelInternalCategories();
    this.listenForFormChanges();
    this._optionallyPatchForm();
  }
  ngOnDestroy(): void {
    this.isLoading = false;
    this.levelTwoInternalCategoriesList = [];
    this.levelThreeInternalCategoriesList = [];
    this.savedLevelOneId = '';
    this.savedLevelTwoId = '';
    this.commonFormPatch('internalCategoryLevelOne','', false);
    this.commonFormPatch('internalCategoryLevelTwo','', false);
    this.commonFormPatch('internalCategoryLevelThree','', false);
    this.internalCategoriesFormGroup.reset(undefined, {emitEvent: false});
  }
  getFirstLevelInternalCategories(): void {
    this.getInternalCategoriesUseCase
      .execute()
      .subscribe((levelOneCategoriesList) => {
        this.levelOneInternalCategoriesList = levelOneCategoriesList;
      });
  }
  onLevelOneChange(selectedLevelOneId) {
    this.savedLevelOneId = selectedLevelOneId;
    this.commonFormPatch('internalCategoryLevelTwo','');
    this.commonFormPatch('internalCategoryLevelThree','');
    this.levelTwoInternalCategoriesList = [];
    this.levelThreeInternalCategoriesList = [];
    this.getSecondLevelInternalCategories();
  }
  getSecondLevelInternalCategories(): void {
    this.getInternalSubCategoriesUseCase
      .execute(this.savedLevelOneId)
      .subscribe((levelTwoCategoriesList) => {
        this.levelTwoInternalCategoriesList = levelTwoCategoriesList;
      });
  }
  onLevelTwoChange(selectedLevelTwoId) {
    this.savedLevelTwoId = selectedLevelTwoId;
    this.commonFormPatch('internalCategoryLevelThree','');
    this.levelThreeInternalCategoriesList = [];
    this.getThirdLevelInternalCategories();
  }
  commonFormPatch(formControlName: string, formValue: any, emitEvent: boolean = true){
    this.internalCategoriesFormGroup.patchValue({
      [formControlName]: formValue,
    }, { emitEvent });
  }
  getThirdLevelInternalCategories(): void {
    this.getInternalSubCategoriesUseCase
      .execute(this.savedLevelTwoId)
      .subscribe((levelThreeCategoriesList) => {
        this.levelThreeInternalCategoriesList = levelThreeCategoriesList;
      });
  }
  listenForFormChanges() {
    this.internalCategoriesFormGroup.valueChanges
      .pipe()
      .subscribe((_) => this.emitBundleAttributesInternalCategoriesForm.emit(
        this.internalCategoriesFormGroup,
        ),
      );
  }
  private _optionallyPatchForm(): void {
    if (this.initialData) {
      this.isLoading = true;
      this.getInternalSubCategoryByIdUseCase.execute(this.initialData).subscribe(levelThreeInternalCategory => {
        this.savedLevelOneId = levelThreeInternalCategory?.ancestors[0]?.categoryId;
        this.savedLevelTwoId = levelThreeInternalCategory?.ancestors[1]?.categoryId;
        forkJoin({
          levelTwoInternalCategoriesList: this.getInternalSubCategoriesUseCase.execute(this.savedLevelOneId),
          levelThreeInternalCategoriesList: this.getInternalSubCategoriesUseCase.execute(this.savedLevelTwoId),
        }).subscribe(({levelTwoInternalCategoriesList, levelThreeInternalCategoriesList}) => {
          this.levelTwoInternalCategoriesList = levelTwoInternalCategoriesList;
          this.levelThreeInternalCategoriesList = levelThreeInternalCategoriesList;
          this.internalCategoriesFormGroup.patchValue({
            internalCategoryLevelOne: this.savedLevelOneId,
            internalCategoryLevelTwo: this.savedLevelTwoId,
            internalCategoryLevelThree: this.initialData,
          });
          this.isLoading = false;
        });
      });
    }
  }
}
