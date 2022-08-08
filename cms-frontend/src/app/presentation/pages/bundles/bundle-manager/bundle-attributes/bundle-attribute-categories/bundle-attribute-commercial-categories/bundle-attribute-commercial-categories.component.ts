/* eslint-disable max-len */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommercialCategoryModel, CommercialSubCategoryModel } from '@core/domain/commercial-category.model';
import { CategoryModel } from '@core/domain/variant-group.model';
import { GetCommercialCategoriesUseCase } from '@core/usecases/commercial-categories/get-commercial-categories.usecase';
import {
  GetCommercialSubCategoriesUseCase,
 } from '@core/usecases/commercial-categories/get-commercial-sub-categories.usecase';
import { GetCommercialSubCategoryByIdUseCase } from '@core/usecases/commercial-categories/get-commercial-sub-category-by-id.usecase';
import { GetCategoriesUseCase } from '@core/usecases/variant-groups/get-categories.usecase';
import { CMS_ADD_EDIT_PRODUCT_COMMERCIAL_CATEGORIES } from '@presentation/@core/contstants/feature-flags';
import { RemoteConfigService } from '@presentation/@core/utils';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'ngx-bundle-attribute-commercial-categories',
  templateUrl: './bundle-attribute-commercial-categories.component.html',
  styleUrls: ['./bundle-attribute-commercial-categories.component.scss'],
})
export class BundleAttributeCommercialCategoriesComponent implements OnInit, OnDestroy {
  @Input() showFormErrors$: Subject<boolean> = new Subject<boolean>();
  @Input() initialData: {
    categoryId: string;
    commercialCategoryIds: Array<string>;
  };
  @Output() emitBundleAttributesCommercialCategoriesForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  isLoadingInitialData = false;
  loadedListGroupsCount = 0;
  isLoadingLevelsCategoriesList = false;
  addEditProductCommercialCategoryFlag = false;
  commercialCategoriesList: CategoryModel[] = [];
  commercialCategoriesListLevelOne: CommercialCategoryModel[]= [];
  commercialCategoriesLists: {
    levelTwo: CommercialSubCategoryModel[];
    levelThree: CommercialSubCategoryModel[];
    levelFour: CommercialSubCategoryModel[];
  }[] = [{
    levelTwo: [],
    levelThree: [],
    levelFour: [],
  }];
  savedLevelOneId: string;
  savedLevelTwoId: string;
  savedLevelThreeId: string;
  commercialCategoriesFormGroup: FormGroup = new FormGroup({
    commercialCategories: new FormControl('', [Validators.required]),
    commercialCategoriesFormGroupArray: new FormArray([]),
  });
  commercialCategoriesItems: FormArray;
  private _onDestroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private _productsService: ProductsService,
    private getCommercialCategoriesUseCase: GetCommercialCategoriesUseCase,
    private getCategoriesUseCase: GetCategoriesUseCase,
    private getCommercialSubCategoriesUseCase: GetCommercialSubCategoriesUseCase,
    private _remoteConfigService: RemoteConfigService,
    private formBuilder: FormBuilder,
    private getCommercialSubCategoryByIdUseCase: GetCommercialSubCategoryByIdUseCase,
  ) {}
  ngOnInit(): void {
    this._remoteConfigService.getFeatureFlags(CMS_ADD_EDIT_PRODUCT_COMMERCIAL_CATEGORIES)
      .subscribe(flag => {
        this.addEditProductCommercialCategoryFlag = flag;
      });
    this._productsService.selectedCountryCodeSubject.subscribe(
      (countryCode) => {
        if (countryCode) {
          this.setCommercialCategoriesList(countryCode);
          this.setCommercialCategoriesListLevelOne(countryCode);
        }
      },
    );
    this.listenForFormChanges();
    this.onAddNewCommercialCategory(false);
    this._optionallyPatchForm();
  }
  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
    this.isLoadingLevelsCategoriesList = false;
    this.savedLevelOneId = '';
    this.savedLevelTwoId = '';
    this.savedLevelThreeId = '';
    this.commercialCategoriesFormGroup.patchValue({
      commercialCategoriesFormGroupArray: [{
        commercialCategoriesLevelFour: null,
        commercialCategoriesLevelOne: new FormControl(null, [Validators.required]),
        commercialCategoriesLevelThree: null,
        commercialCategoriesLevelTwo: null,
      }],
    }, {emitEvent: false});
    (this.commercialCategoriesItems.value as Array<any>).forEach((item, index) => {
      if (index !== 0) {
        this.commercialCategoriesItems.removeAt(index, {emitEvent: false});
      }
    });
    this.commercialCategoriesItems.reset(undefined, {emitEvent: false});
    this.commercialCategoriesFormGroup.reset(undefined, {emitEvent: false});
  }
  createCommercialCategoriesItems() {
    return this.formBuilder.group({
      commercialCategoriesLevelOne: new FormControl('', [Validators.required]),
      commercialCategoriesLevelTwo: new FormControl(''),
      commercialCategoriesLevelThree: new FormControl(''),
      commercialCategoriesLevelFour: new FormControl(''),
    });
  }
  onAddNewCommercialCategory(emitEvent: boolean = true): void{
    this.commercialCategoriesLists.push({
      levelTwo: [],
      levelThree: [],
      levelFour: [],
    });
    this.commercialCategoriesItems =
      this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray') as FormArray;
    this.commercialCategoriesItems.push(this.createCommercialCategoriesItems(), { emitEvent });
  }
  onDeleteNewCommercialCategory(index) {
    (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray') as FormArray)
      .removeAt(index);
      this.commercialCategoriesLists.splice(index,1);
  }
  getCommercialCategoriesFormGroupArrayControls(){
    return (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray') as FormArray).controls;
  }
  getCommercialCategoriesFormGroupArrayLength(){
    return (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray') as FormArray).length;
  }
  setCommercialCategoriesList(countryCode: string){
    this.getCategoriesUseCase.execute({
      filter: {
        country: countryCode,
      },
    }).pipe(takeUntil((this._onDestroy$))).subscribe((categories) => {
      this.commercialCategoriesList = categories;
    });
  }
  setCommercialCategoriesListLevelOne(countryCode: string){
    this.toggleLoading();
    this.getCommercialCategoriesUseCase.execute(countryCode)
    .pipe(takeUntil(this._onDestroy$),finalize(() => this.toggleLoading()))
    .subscribe(
      (levelOneCategories) => {
        this.commercialCategoriesListLevelOne = levelOneCategories;
      },
    );
  }
  onLevelOneChange(levelOneId, index) {
    this.savedLevelOneId = levelOneId;
    const resetData = {
      commercialCategoriesLevelTwo:'',
      commercialCategoriesLevelThree:'',
      commercialCategoriesLevelFour:'',
    };
    const changedFormGroup =
      (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(index);
    changedFormGroup.patchValue(resetData);
    this.commercialCategoriesLists[index].levelTwo = [];
    this.commercialCategoriesLists[index].levelThree = [];
    this.commercialCategoriesLists[index].levelFour = [];
    this.setCommercialCategoriesListLevelTwo(index);
  }
  setCommercialCategoriesListLevelTwo(index){
    this.toggleLoading();
    this.getCommercialSubCategoriesUseCase.execute(this.savedLevelOneId).
    pipe(takeUntil(this._onDestroy$),finalize(() => this.toggleLoading()))
    .subscribe(
      (levelTwoCategories) => {
        this.commercialCategoriesLists[index].levelTwo = levelTwoCategories;
      },
    );
  }
  onLevelTwoChange(levelTwoId, index) {
    this.savedLevelTwoId = levelTwoId;
    const resetData = {
      commercialCategoriesLevelThree:'',
      commercialCategoriesLevelFour:'',
    };
    const changedFormGroup =
      (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(index);
    changedFormGroup.patchValue(resetData);
    this.commercialCategoriesLists[index].levelThree  = [];
    this.commercialCategoriesLists[index].levelFour  = [];
    this.setCommercialCategoriesListLevelThree(index);
  }
  setCommercialCategoriesListLevelThree(index){
    this.toggleLoading();
    this.getCommercialSubCategoriesUseCase.execute(this.savedLevelTwoId)
    .pipe(takeUntil(this._onDestroy$),finalize(() => this.toggleLoading()))
    .subscribe(
      (levelThreeCategories) => {
        this.commercialCategoriesLists[index].levelThree = levelThreeCategories;
      },
    );
  }
  onLevelThreeChange(levelThreeId, index) {
    this.savedLevelThreeId = levelThreeId;
    const resetData = {
      commercialCategoriesLevelFour:'',
    };
    const changedFormGroup =
      (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(index);
    changedFormGroup.patchValue(resetData);
    this.commercialCategoriesLists[index].levelFour  = [];
    this.setCommercialCategoriesListLevelFour(index);
  }
  setCommercialCategoriesListLevelFour(index){
    this.toggleLoading();
    this.getCommercialSubCategoriesUseCase.execute(this.savedLevelThreeId)
    .pipe(takeUntil(this._onDestroy$),finalize(() => this.toggleLoading()))
    .subscribe(
      (levelFourCategories) => {
        this.commercialCategoriesLists[index].levelFour = levelFourCategories;
      },
    );
  }
  listenForFormChanges() {
    this.commercialCategoriesFormGroup.valueChanges.pipe(takeUntil(this._onDestroy$)).subscribe((_) => {
      this.emitBundleAttributesCommercialCategoriesForm.emit(
        this.commercialCategoriesFormGroup,
        );
    });
  }
  toggleLoading(){
    this.isLoadingLevelsCategoriesList = !this.isLoadingLevelsCategoriesList;
  }
  private _optionallyPatchForm(): void {
    if(this.initialData.categoryId && this.initialData.commercialCategoryIds) {
      this.isLoadingInitialData = true;
      this.initialData.commercialCategoryIds.map((bundleCommercialCategoryId, commercialCategoryGroupIndex, commercialCategories) => {
        if(commercialCategoryGroupIndex < commercialCategories.length-1) {
          this.onAddNewCommercialCategory(false);
        }
        let commercialCategoriesIdsList = [];
        this.getCommercialSubCategoryByIdUseCase.execute(bundleCommercialCategoryId).pipe(takeUntil(this._onDestroy$)).subscribe(commercialCategoryDetails => {
          commercialCategoriesIdsList = commercialCategoryDetails.ancestors.map(ancestor => ancestor.id);
          if(!commercialCategoriesIdsList.length) {
            this._patchCommercialCategorySingleLevel(commercialCategoryGroupIndex, bundleCommercialCategoryId);
          } else {
            this._patchCommercialCategoryMultipleLevels(commercialCategoryGroupIndex, bundleCommercialCategoryId, commercialCategoriesIdsList);
          }
        });
      });
      this.commercialCategoriesFormGroup.patchValue({
        commercialCategories: this.initialData.categoryId,
      });
    }
  }
  private _patchCommercialCategorySingleLevel(commercialCategoryGroupIndex: number, bundleCommercialCategoryId: string ): void {
    (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(commercialCategoryGroupIndex).get('commercialCategoriesLevelOne').patchValue(bundleCommercialCategoryId);
    this._incrementLoadedGroupsCountAndSetLoadingStatus();
  }
  private _patchCommercialCategoryMultipleLevels(commercialCategoryGroupIndex: number, bundleCommercialCategoryId: string, commercialCategoriesIdsList: Array<string>) {
    forkJoin(commercialCategoriesIdsList.map(
      ancestorCategoryId => (this.getCommercialSubCategoriesUseCase.execute(ancestorCategoryId)),
    )).pipe(takeUntil(this._onDestroy$)).subscribe(commercialSubCategoriesLists => {
      this._fillCommercialCategoryGroupsLists(commercialSubCategoriesLists, commercialCategoryGroupIndex);
      commercialCategoriesIdsList.push(bundleCommercialCategoryId);
      this._patchCommercialCategoriesFormGroupControls(commercialCategoriesIdsList, commercialCategoryGroupIndex);
      this._incrementLoadedGroupsCountAndSetLoadingStatus();
    });
  }
  private _fillCommercialCategoryGroupsLists(commercialSubCategoriesLists: Array<CommercialSubCategoryModel[]>, commercialCategoryGroupIndex: number): void {
    commercialSubCategoriesLists.map((list, listIndex) => {
      switch(listIndex) {
        case 0:
          this.commercialCategoriesLists[commercialCategoryGroupIndex].levelTwo = list;
          break;
        case 1:
          this.commercialCategoriesLists[commercialCategoryGroupIndex].levelThree = list;
          break;
        case 2:
            this.commercialCategoriesLists[commercialCategoryGroupIndex].levelFour = list;
          break;
      }
    });
  }
  private _patchCommercialCategoriesFormGroupControls(commercialCategoriesIdsList: Array<string>, commercialCategoryGroupIndex: number): void {
    commercialCategoriesIdsList.map((commercialCategoryId, commercialCategoryIdIndex) => {
      switch(commercialCategoryIdIndex) {
        case 0:
          (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(commercialCategoryGroupIndex).get('commercialCategoriesLevelOne').patchValue(commercialCategoryId);
          break;
        case 1:
          (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(commercialCategoryGroupIndex).get('commercialCategoriesLevelTwo').patchValue(commercialCategoryId);
          break;
        case 2:
          (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(commercialCategoryGroupIndex).get('commercialCategoriesLevelThree').patchValue(commercialCategoryId);
          break;
        case 3:
          (this.commercialCategoriesFormGroup.get('commercialCategoriesFormGroupArray')as FormArray).at(commercialCategoryGroupIndex).get('commercialCategoriesLevelFour').patchValue(commercialCategoryId);
          break;
        }
      });
  }
  private _incrementLoadedGroupsCountAndSetLoadingStatus(): void {
    this.loadedListGroupsCount++;
    if(this.loadedListGroupsCount === this.initialData.commercialCategoryIds.length) {
      this.isLoadingInitialData = false;
    }
  }
}
