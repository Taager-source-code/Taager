import { Component, OnInit } from '@angular/core';
import {
  AVAILABILITY_STATUSES, VARIANT_TABLE_HEADERS_POST_VARIANTS, VARIANT_TABLE_HEADERS_PRE_VARIANTS,
} from '@data/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AttributeSet, VariantAttribute, VariantModel } from '@core/domain/variant-group.model';
import { COLOR_VARIANTS } from '@presentation/@core/contstants/color-variants';
import { ColorVariant } from '@presentation/@core/interfaces/color-variants.interface';
import { ProductsService } from '@presentation/@core/utils/products.service';
@Component({
  selector: 'ngx-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss'],
})
export class ProductVariantsComponent implements OnInit {
  public productHasVariants = false;
  public variantTableHeaders;
  public showImagesRowId: string = undefined;
  public availabilityStatuses = AVAILABILITY_STATUSES;
  public isEditProductDialog = false;
  public attributeSets: AttributeSet[] = [];
  public colorVariantsGroups: ColorVariant[][] = [];
  public preSelectedColorVariants: string[] = [];
  public selectedColorVariants: string[] = [];
  public sizeVariantsForm = new FormGroup({
    addedSize: new FormControl('', Validators.required),
  });
  public preSelectedSizeVariants: string[] = [];
  public selectedSizeVariants: string[] = [];
  public variantsAttributesLookup: { [_id: string]: { color?: string; colorArabicName?: string; size?: string } };
  constructor(
    public productsService: ProductsService,
  ) { }
  ngOnInit(): void {
    this.attributeSets = this.productsService.editedVariantGroup?.attributeSets || [];
    this.setupPrimaryVariantAttribute();
    this.isEditProductDialog = !!this.productsService.editedVariantGroup;
    this.productHasVariants = !!this.attributeSets.length;
    this.setupColorVariantsGroups();
    this.setupPreSelectedColorVariants();
    this.setupPreSelectedSizeVariants();
    this.setupVariantAttributesLookupTable();
    this.setupTableHeders();
  }
  setupPrimaryVariantAttribute() {
    this.productsService.variants.forEach(variant => {
      variant.isPrimary = variant._id === this.productsService.editedVariantGroup.primaryVariantId;
    });
  }
  setupPreSelectedColorVariants(): void {
    this.preSelectedColorVariants = this.attributeSets
      .filter(attributeSet => attributeSet.type === 'color')[0]?.attributes
      .map(attribute => attribute.name) || [];
    this.selectedColorVariants = [...this.preSelectedColorVariants];
  }
  setupColorVariantsGroups(): void {
    const colorVariantsGroups: { [key: string]: ColorVariant[] } =
      COLOR_VARIANTS.reduce((accumulator, colorVariant) => {
        accumulator[colorVariant.group] = accumulator[colorVariant.group] ?
          [...accumulator[colorVariant.group], colorVariant] : [colorVariant];
        return accumulator;
      }, {} as { [key: string]: ColorVariant[] });
    this.colorVariantsGroups = [];
    for (const key of Object.keys(colorVariantsGroups)) {
      this.colorVariantsGroups.push(colorVariantsGroups[key]);
    }
  }
  onSelectedColorVariantsChange(event: string[]) {
    this.onSetupVariantsCombinations();
  }
  setupPreSelectedSizeVariants(): void {
    this.preSelectedSizeVariants = this.attributeSets
      .filter(attributeSet => attributeSet.type === 'size')[0]?.attributes
      .map(attribute => attribute.name) || [];
    this.selectedSizeVariants = [...this.preSelectedSizeVariants];
  }
  onAddSizeVariant(): void {
    const addedSize = this.sizeVariantsForm.get('addedSize').value;
    if (!this.selectedSizeVariants.includes(addedSize) && !this.sizeVariantsForm.invalid) {
      this.selectedSizeVariants = this.selectedSizeVariants ? [...this.selectedSizeVariants, addedSize] : [addedSize];
      this.sizeVariantsForm.reset();
      this.onSetupVariantsCombinations();
    }
  }
  onReOrderSizeVariant(index) {
    if (index !== 0) {
      [this.selectedSizeVariants[index], this.selectedSizeVariants[index - 1]] =
        [this.selectedSizeVariants[index - 1], this.selectedSizeVariants[index]];
      this.onSetupVariantsCombinations();
    }
  }
  onDeleteSizeVariant(index) {
    if (this.preSelectedSizeVariants.indexOf(this.selectedSizeVariants[index]) === -1) {
      this.selectedSizeVariants = this.selectedSizeVariants.filter(sizeVariant =>
        sizeVariant !== this.selectedSizeVariants[index]);
      this.onSetupVariantsCombinations();
    }
  }
  toggle(productHasVariantsChecked) {
    this.productHasVariants = productHasVariantsChecked;
  }
  showImagesClicked(id) {
    if (this.showImagesRowId !== id) {
      this.showImagesRowId = id;
    } else {
      this.showImagesRowId = undefined;
    }
  }
  onSetupVariantsCombinations(): void {
    let variants: VariantModel[] = [];
    if (this.selectedSizeVariants.length && this.selectedColorVariants.length) {
      variants = this.getTwoTypesVariants(
        { values: this.selectedColorVariants, name: 'color' },
        { values: this.selectedSizeVariants, name: 'size' },
      );
    } else if (this.selectedSizeVariants.length) {
      variants = this.getSingleTypeVariants(this.selectedSizeVariants, 'size');
    } else if (this.selectedColorVariants.length) {
      variants = this.getSingleTypeVariants(this.selectedColorVariants, 'color');
    } else {
      variants = [];
    }
    this.productsService.variants = variants;
    this.resetPrimaryVariant();
    this.setupVariantAttributesLookupTable();
    this.setupTableHeders();
    this.updateVariantGroupAttributeSets();
  }
  updateVariantGroupAttributeSets() {
    const attributeSets = [];
    const colorAttributeSet = {
      type: 'color',
      attributes: this.selectedColorVariants.map(item => ({ name: item })),
    };
    const sizeAttributeSet = {
      type: 'size',
      attributes: this.selectedSizeVariants.map(item => ({ name: item })),
    };
    if (colorAttributeSet.attributes.length > 0) {
      attributeSets.push(colorAttributeSet);
    }
    if (sizeAttributeSet.attributes.length > 0) {
      attributeSets.push(sizeAttributeSet);
    }
    this.productsService.editedVariantGroup = { ...this.productsService.editedVariantGroup, attributeSets };
  }
  getTwoTypesVariants(
    firstAttributeType: { values: string[]; name: string },
    secondAttributeType: { values: string[]; name: string },
  ): VariantModel[] {
    const variants: VariantModel[] = [];
    firstAttributeType.values.map(firstAttributeValue => {
      secondAttributeType.values.map(secondAttributeValue => {
        const attribute: VariantAttribute[] = [
          {
            type: firstAttributeType.name,
            value: firstAttributeValue,
          },
          {
            type: secondAttributeType.name,
            value: secondAttributeValue,
          },
        ];
        variants.push(this.getVariantWithAttributes(attribute));
      });
    });
    return variants;
  }
  getSingleTypeVariants(selectedValuesArray, attributeName): VariantModel[] {
    return selectedValuesArray.map(attributeValue => {
      const attribute: VariantAttribute[] = [{
        type: attributeName,
        value: attributeValue,
      }];
      return this.getVariantWithAttributes(attribute);
    });
  }
  getVariantWithAttributes(attributes: VariantAttribute[]): VariantModel {
    let fetchedVariant = this.productsService.variants.filter(_variant =>
      JSON.stringify(_variant.attributes) === JSON.stringify(attributes),
    )[0];
    if (!fetchedVariant) {
      fetchedVariant = this.generateNewVariant(attributes);
    }
    return fetchedVariant;
  }
  generateNewVariant(attributes: VariantAttribute[]): VariantModel {
    return {
      _id: 'temp_' + Math.random().toString(36).slice(2),
      productId: '',
      productName: '',
      country: this.productsService.selectedCountryCode,
      price: null,
      purchasePrice: null,
      profit: null,
      variantImages: [],
      videosLinks: [],
      description: '',
      specifications: '',
      inStock: true,
      howToUse: '',
      attributes,
      isExpired: false,
      productAvailability: '',
      categoryName: '',
      categoryId: '',
      isPrimary: false,
      isDisabled: false,
      visibleToSellers: [],
    };
  }
  resetPrimaryVariant(): void {
    const primaryVariant = this.productsService.variants.filter(variant => variant.isPrimary)[0];
    const canBePrimaryVariants = this.productsService.variants.filter(
      variant => !variant.isDisabled && !variant.isExpired,
    );
    if (!primaryVariant || primaryVariant.isDisabled || primaryVariant.isExpired) {
      if (primaryVariant) {
        primaryVariant.isPrimary = false;
      }
      if (canBePrimaryVariants.length) {
        canBePrimaryVariants[0].isPrimary = true;
      }
    }
    if(!this.productsService.variants.filter(variant => variant.isPrimary).length) {
      this.productsService.variants[0].isPrimary = true;
    }
  }
  onSelectNewPrimary(selectedVariant: VariantModel): void {
    if (!selectedVariant.isExpired && !selectedVariant.isDisabled) {
      this.productsService.variants.forEach(variant => {
        variant.isPrimary = false;
      });
      selectedVariant.isPrimary = true;
    }
  }
  setupTableHeders(): void {
    this.variantTableHeaders = [...VARIANT_TABLE_HEADERS_PRE_VARIANTS];
    if (this.selectedSizeVariants.length) {
      this.variantTableHeaders.push('SIZE');
    }
    if (this.selectedColorVariants.length) {
      this.variantTableHeaders.push('COLOR');
    }
    this.variantTableHeaders = [...this.variantTableHeaders, ...VARIANT_TABLE_HEADERS_POST_VARIANTS];
  }
  setupVariantAttributesLookupTable(): void {
    this.variantsAttributesLookup = {};
    this.productsService.variants.map(variant => {
      const color = variant.attributes?.filter(attribute => attribute.type === 'color')[0]?.value;
      const size = variant.attributes?.filter(attribute => attribute.type === 'size')[0]?.value;
      this.variantsAttributesLookup[variant._id] = {
        color,
        colorArabicName: COLOR_VARIANTS.filter(colorObject => colorObject.color === color)[0]?.arabicColorName,
        size,
      };
    });
  }
  onUpdateVariantsImages(variantImages: string[], variantId: string): void {
    this.productsService.variants = this.productsService.variants.map(variant => (
      variant._id === variantId ? { ...variant, variantImages } : variant
    ));
  }
}
