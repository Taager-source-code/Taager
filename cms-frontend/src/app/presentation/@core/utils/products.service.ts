import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryModel } from '@core/domain/country.model';
import { VariantGroupModel, VariantModel } from '@core/domain/variant-group.model';
import { GetCountriesUseCase } from '@core/usecases/country/get-countries.usecase';
import { BehaviorSubject } from 'rxjs';
import { initialCommercialCategoriesFormGroup } from '@presentation/@core/contstants/categories';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  public selectedCountryCode;
  public countriesList: CountryModel[] = [];
  public variants: VariantModel[] = [];
  public editedVariantGroupId = new BehaviorSubject<string>(undefined);
  public selectedCountryCodeSubject = new BehaviorSubject<string>(undefined);
  public productForm: FormGroup;
  private _editedVariantGroup: VariantGroupModel;
  constructor(
    private formBuilder: FormBuilder,
    private getCountriesUseCase: GetCountriesUseCase,
  ) {
    this.initializeForm();
    this.getCountries();
  }
  public get editedVariantGroup(): VariantGroupModel {
    return this._editedVariantGroup;
  }
  public set editedVariantGroup(value: VariantGroupModel) {
    this._editedVariantGroup = value;
    if (this._editedVariantGroup) {
      const variantGroupHasSingleVariant = !this._editedVariantGroup?.attributeSets ||
        !this._editedVariantGroup.attributeSets.length;
      if (!variantGroupHasSingleVariant) {
        this.clearAndDisableVariantCommonFields();
      } else {
        this.enableVariantCommonFields();
      }
    }
  }
  public initializeFormWithVariantGroup(variantGroup: VariantGroupModel) {
    const variantGroupHasSingleVariant = !variantGroup.attributeSets.length;
    const {
      productName,
      price: productPrice,
      purchasePrice: productPurchasePrice,
      profit: productProfit,
      productId: productID,
      weight: productWeight,
      quantity: productQuantity,
      description: productDescription,
      specifications: productSpecification,
      howToUse: productHowToUse,
      productAvailability: availability,
      isExpired: productIsExpired,
      videosLinks,
      country,
      categoryId,
      categoryName,
    } = variantGroup.variants[0];
    const imageUrls = [
      ...this.variants[0].variantImages,
    ].filter(url => url);
    this.productForm = this.formBuilder.group({
      productCountryForm: this.formBuilder.group({
        country: new FormControl({ value: country, disabled: true }, Validators.required),
      }),
      productInfoForm: this.formBuilder.group({
        productName,
        productPrice: new FormControl({
          value: variantGroupHasSingleVariant ? productPrice : '',
          disabled: !variantGroupHasSingleVariant,
        }),
        productPurchasePrice,
        productProfit: new FormControl({
          value: variantGroupHasSingleVariant ? productProfit : '',
          disabled: !variantGroupHasSingleVariant,
        }),
        productID: new FormControl({
          value: variantGroupHasSingleVariant ? productID : '',
          disabled: !variantGroupHasSingleVariant,
        }),
        productWeight,
        productQuantity,
        productDescription,
        productSpecification,
        productHowToUse,
        availability: new FormControl({
          value: variantGroupHasSingleVariant ? availability : '',
          disabled: !variantGroupHasSingleVariant,
        }),
        productIsExpired: new FormControl({
          value: variantGroupHasSingleVariant ? productIsExpired : false,
          disabled: !variantGroupHasSingleVariant,
        }),
      }),
      productMediaForm: this.formBuilder.group({
        imageUrls: new FormControl({
          value: variantGroupHasSingleVariant ? imageUrls : [],
          disabled: !variantGroupHasSingleVariant,
        }),
        videosLinks: videosLinks.length ? [videosLinks.map(link => ({ url: link }))] : [[{ url: '' }]],
      }),
      productCategoryForm: this.formBuilder.group({
        categoryId,
        categoryName,
        internalCategoryForm: this.formBuilder.group({
          levelOneCategoryId: undefined,
          levelTwoCategoryId: undefined,
          levelThreeCategoryId: undefined,
        }),
        commercialCategoryForm: variantGroup.commercialCategoryIds?.length ?
          this.formBuilder.array([
            ...variantGroup.commercialCategoryIds.map(() =>
              this.formBuilder.group({ ...initialCommercialCategoriesFormGroup }),
            )])
          : this.formBuilder.array([this.formBuilder.group({ ...initialCommercialCategoriesFormGroup })]),
      }),
      productSpecificationForm: this.formBuilder.group({
        visibleToSellers: this._editedVariantGroup?.visibleToSellers?.join(',') || [],
        visibleToSellersTaagerIds: '',
      }),
    });
  }
  public initializeForm() {
    this.productForm = this.formBuilder.group({
      productCountryForm: this.formBuilder.group({
        country: this.selectedCountryCode,
      }),
      productInfoForm: this.formBuilder.group({
        productName: '',
        productPrice: '',
        productPurchasePrice: '',
        productProfit: '',
        productID: '',
        productWeight: '',
        productQuantity: '',
        productDescription: '',
        productSpecification: '',
        productHowToUse: '',
        availability: '',
        productIsExpired: false,
      }),
      productMediaForm: this.formBuilder.group({
        imageUrls: [[]],
        videosLinks: [[{ url: '' }]],
      }),
      productCategoryForm: this.formBuilder.group({
        categoryId: '',
        categoryName: '',
        internalCategoryForm: this.formBuilder.group({
          levelOneCategoryId: undefined,
          levelTwoCategoryId: undefined,
          levelThreeCategoryId: undefined,
        }),
        commercialCategoryForm: this.formBuilder.array([
          this.formBuilder.group({ ...initialCommercialCategoriesFormGroup }),
        ]),
      }),
      productSpecificationForm: this.formBuilder.group({
        visibleToSellers: '',
        visibleToSellersTaagerIds: '',
      }),
    });
  }
  getVariantGroup(): VariantGroupModel {
    const variantGroup: VariantGroupModel = this._editedVariantGroup || new Object() as VariantGroupModel;
    const variantGroupHasSingleVariant = !this._editedVariantGroup?.attributeSets ||
      !this._editedVariantGroup?.attributeSets?.length;
    if (variantGroupHasSingleVariant) {
      this.variants = [new Object() as VariantModel];
      this.setVariantsGenericData();
      this.variants[0]._id = this._editedVariantGroup?.variants[0]._id;
      this.variants[0].productId = this.productForm.get('productInfoForm').get('productID').value;
      this.variants[0].price = this.productForm.get('productInfoForm').get('productPrice').value;
      this.variants[0].profit = this.productForm.get('productInfoForm').get('productProfit').value;
      this.variants[0].variantImages =
        this.productForm.get('productMediaForm').get('imageUrls').value as string[] || [];
      this.variants[0].isExpired = this.productForm.get('productInfoForm').get('productIsExpired').value;
      this.variants[0].productAvailability = this.productForm.get('productInfoForm').get('availability').value;
      this.variants[0].isPrimary = true;
      this.variants[0].Category = this.productForm.get('productCategoryForm').get('categoryName').value;
      variantGroup.variants = [this.variants[0]];
    } else {
      this.setVariantsGenericData();
      variantGroup.variants = this.variants.map((variant) => {
        const newVariant = { ...variant };
        newVariant._id = newVariant._id.startsWith('temp_') ? undefined : newVariant._id;
        return newVariant;
      });
      variantGroup.attributeSets = variantGroup.attributeSets.map(
        attribute => ({ ...attribute, category: this.variants[0].categoryName }),
      );
    }
    variantGroup.visibleToSellers = (
      this.productForm.get('productSpecificationForm').get('visibleToSellers').value as string || ''
    ).split(',').filter((item) => item && item.trim().length !== 0);
    variantGroup.country = this.selectedCountryCode;
    variantGroup.productName = this.variants[0].productName;
    variantGroup.categoryId = this.variants[0].categoryId;
    variantGroup.internalCategoryId = this.productForm.get('productCategoryForm')
      .get('internalCategoryForm').get('levelThreeCategoryId').value;
    variantGroup.commercialCategoryIds = this.getSelectedCommercialCategoryIds();
    return variantGroup;
  }
  getCountries() {
    this.getCountriesUseCase.execute().subscribe(countries => {
      this.countriesList = countries;
      this.setSelectedCountryCode(countries[0].isoCode3);
    });
  }
  setEditedVariantGroupId(id): void {
    this.editedVariantGroupId.next(id);
  }
  clearEditedVariantGroupId(): void {
    this.editedVariantGroupId.next(undefined);
  }
  setSelectedCountryCode(code): void {
    if (code !== this.selectedCountryCode) {
      this.selectedCountryCodeSubject.next(code);
      this.selectedCountryCode = code;
    }
  }
  setVariantsGenericData(): void {
    this.variants = this.variants.map(variant => ({
      ...variant,
      country: this.selectedCountryCode,
      productName: this.productForm.get('productInfoForm').get('productName').value,
      purchasePrice: this.productForm.get('productInfoForm').get('productPurchasePrice').value,
      weight: this.productForm.get('productInfoForm').get('productWeight').value,
      quantity: this.productForm.get('productInfoForm').get('productQuantity').value,
      description: this.productForm.get('productInfoForm').get('productDescription').value,
      specifications: this.productForm.get('productInfoForm').get('productSpecification').value,
      howToUse: this.productForm.get('productInfoForm').get('productHowToUse').value,
      categoryId: this.productForm.get('productCategoryForm').get('categoryId').value,
      categoryName: this.productForm.get('productCategoryForm').get('categoryName').value,
      visibleToSellers: (
        this.productForm.get('productSpecificationForm').get('visibleToSellers').value as string ?? ''
      ).split(',').filter((item) => item && item.trim().length !== 0),
      videosLinks: (
        (this.productForm.get('productMediaForm').get('videosLinks').value as { url: string }[])
          .map(({ url }) => url) || []
      ).filter(
        (item) => item && item.trim().length !== 0,
      ),
    }));
  }
  clearAndDisableVariantCommonFields(): void {
    this.productForm.get('productInfoForm').get('productID').reset();
    this.productForm.get('productInfoForm').get('productID').disable();
    this.productForm.get('productInfoForm').get('productPrice').reset();
    this.productForm.get('productInfoForm').get('productPrice').disable();
    this.productForm.get('productInfoForm').get('productProfit').reset();
    this.productForm.get('productInfoForm').get('productProfit').disable();
    this.productForm.get('productInfoForm').get('productIsExpired').reset();
    this.productForm.get('productInfoForm').get('productIsExpired').disable();
    this.productForm.get('productInfoForm').get('availability').reset();
    this.productForm.get('productInfoForm').get('availability').disable();
    this.productForm.get('productMediaForm').get('imageUrls').reset();
    this.productForm.get('productMediaForm').get('imageUrls').disable();
  }
  enableVariantCommonFields(): void {
    this.productForm.get('productInfoForm').get('productID').enable();
    this.productForm.get('productInfoForm').get('productPrice').enable();
    this.productForm.get('productInfoForm').get('productProfit').enable();
    this.productForm.get('productInfoForm').get('productIsExpired').enable();
    this.productForm.get('productInfoForm').get('availability').enable();
    this.productForm.get('productMediaForm').get('imageUrls').enable();
  }
  addToCommercialCategoryForm(): void {
    (this.productForm.get('productCategoryForm.commercialCategoryForm') as FormArray).push(
      this.formBuilder.group(initialCommercialCategoriesFormGroup));
  }
  deleteFromCommercialCategoryForm(deletedIndex: number): void {
    this._editedVariantGroup.commercialCategoryIds =
      this._editedVariantGroup.commercialCategoryIds
        .filter(((category, currentIndex) => currentIndex !== deletedIndex));
    (this.productForm.get('productCategoryForm.commercialCategoryForm') as FormArray).removeAt(deletedIndex);
  }
  getSelectedCommercialCategoryIds(): string[] {
    const commercialCategoriesFormGroups =
    (this.productForm.get('productCategoryForm.commercialCategoryForm') as FormArray).controls;
    return commercialCategoriesFormGroups.map(categoryFormGroup =>
      categoryFormGroup.value.levelFourCategoryId ||
      categoryFormGroup.value.levelThreeCategoryId ||
      categoryFormGroup.value.levelTwoCategoryId ||
      categoryFormGroup.value.levelOneCategoryId ,
    ).filter(categoryFormGroup => categoryFormGroup);
  }
}
