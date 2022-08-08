/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */
import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from '@angular/core';
import { forkJoin, of } from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';
import { CarouselInterface, CategoryInterface } from 'src/app/presentation/shared/interfaces/product.interafce';
import { CatalogService } from 'src/app/presentation/shared/services/catalog.service';
import { VariantGroup } from 'src/app/presentation/shared/interfaces/variant';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { User } from 'src/app/presentation/shared/interfaces/user.interface';
import { catchError } from 'rxjs/operators';
import { SORT_BY_CREATED_AT, SORT_BY_ORDER_COUNT } from 'src/app/presentation/shared/constants/category-products';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { CartService } from 'src/app/presentation/shared/services/cart.service';
import { CategoryService } from 'src/app/presentation/shared/services/category.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { CommercialCategoriesService } from '../../shared/services/commercial-categories.service';
import { CommercialCategoryTreeNode } from '../../shared/interfaces/commercial-categories.interface';
import { GetPlaceOrdersAvailabilityUseCase } from 'src/app/core/usecases/get-place-orders-availability.usecase';
import { Country } from '../../shared/interfaces/countries';
import { GetCommercialCategoriesUseCase } from 'src/app/core/usecases/get-commercial-categories-usecase';
import { CommercialCategoryModel } from 'src/app/core/domain/commercial-categories.model';
import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';
import { FEATURE_FLAGS } from '../../shared/constants';

declare let gtag;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [CommercialCategoriesService]
})

export class ProductDetailsComponent implements OnInit {

  public variantGroup: VariantGroup;
  public productName: string;
  public product: any;
  public isOrderNow = false;
  public selectedProducts = [];
  productAvailiblityStatus: string;
  inStock: boolean;
  public user: User;
  public showNavigationArrows = false;
  public showVidNavigationArrows = false;
  public showLargeNavigationArrows = false;

  public productImgArr: string[] = [];
  public productImgIdx: number;
  public productVidArr: any[] = [];
  public productVidTypeArr: string[] = [];

  public variantPossibleAttributes: { color?: string; size?: string }[];
  public colorVariantArr: string[] = [];
  public colorNamesArray: string[] = [];
  public selectedColor: string;

  public sizeVariantArr: string[] = [];
  public selectedSize: string;

  public numberOfItems = 1;

  public productDetails: string;
  public productSpecification: any[] = [];
  public productHowToUse: string;
  public detailsSectionSelected = '';

  public bestSellerCategories: CommercialCategoryModel[] | CategoryInterface[] = [];
  public bestSellerCarouselData: CarouselInterface;
  public bestSellersLoading = true;

  public facebookShareLink: string;
  public whatsappShareLink: string;

  public categoryNavigationQueryParams;

  public isCataloged;
  public productInvalid = false;

  public isCatalogDataLoaded = false;

  public currency: string;

  public categoryHierachy: CommercialCategoryTreeNode[];
  public selectedCountry: Country;

  public commercialCategoryFlag = false;

  boldPattern = /^\*.+\* *$/;
  starRegex = /\*/gi;

  private variantId: string;

  constructor(
    public getPlaceOrderAvailabilityUseCase: GetPlaceOrdersAvailabilityUseCase,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    private catalogService: CatalogService,
    private cartService: CartService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
    private mixpanelService: MixpanelService,
    private multitenancyService: MultitenancyService,
    private commercialCategoriesService: CommercialCategoriesService,
    private _getCommercialCategoriesUseCase: GetCommercialCategoriesUseCase,
    private _getFeatureFlagUseCase: GetFeatureFlagUsecase,
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.isOrderNow = false;
  }

  ngOnInit(): void {

    this.getBestSellerCategories();

    this.route.params.subscribe((params) => {
      this.variantId = params.id;
      this.user = this.localStorageService.getUser();
      forkJoin(
        {
          isCataloged: this.catalogService.getProductIsCataloged(this.variantId).pipe(catchError(() => of(undefined))),
          variantGroup: this.productService.getVariantGroupByVariantId(this.variantId).pipe(catchError(() => of(undefined)))
        }
      ).subscribe(
        ({ isCataloged, variantGroup }) => {
          this.isCataloged = isCataloged;
          this.variantGroup = variantGroup;
          this.processProduct();
          this.getCatalogedProducts();
          this.getCategoryHeirarchy();

        });
    });

    this.facebookShareLink = 'http://www.facebook.com/share.php?u=' + window.location.href;
    this.whatsappShareLink = 'https://api.whatsapp.com/send?text=Check out this product! ' + window.location.href;
    this.selectedCountry = this.multitenancyService.getCurrentCountry();
  }

  getIsCataloged() {
    this.catalogService.getProductIsCataloged(this.variantId).subscribe(
      (res) => {
        this.isCataloged = res;
      }
    );
  }

  getBestSellerCategories(): void {
    if (!isDevMode()) {
      this._getFeatureFlagUseCase.execute(FEATURE_FLAGS.COMMERCIAL_CATEGORIES_FLAG).subscribe((flag) => {
        this.commercialCategoryFlag = flag;
        if(this.commercialCategoryFlag) {
          this.getBestSellerCommercialCategories();
        } else {
          this.getBestSellersCategories();
        }
      });
    } else {
      this.commercialCategoryFlag = true;
      this.getBestSellerCommercialCategories();
    }
  }

  getBestSellerCommercialCategories(): void {
    this._getCommercialCategoriesUseCase.execute(this.multitenancyService.getCurrentCountry().isoCode3).subscribe(commercialCategories => {
      this.bestSellerCategories = commercialCategories.slice(0, 4);
      this.bestSellerCarouselData = {
        title: '',
        categoryName: this.bestSellerCategories[0].name.arabicName,
        sorting: SORT_BY_ORDER_COUNT
      };
      this.bestSellersLoading = false;
    });
  }

  getBestSellersCategories(): void {
    this.categoryService.getCategories().subscribe(res => {
      const categories = res.data;
      this.bestSellerCategories = categories
        .filter(category => category.name !== 'all-items')
        .sort((x, y) => {
          if (x.orderCount > y.orderCount) {
            return -1;
          } else if (x.orderCount === y.orderCount) {
            return 0;
          } else {
            return 1;
          }
        })
        .slice(0, 4);
      this.bestSellerCarouselData = {
        title: '',
        categoryName: (this.bestSellerCategories as CategoryInterface[])[0].text,
        sorting: SORT_BY_ORDER_COUNT };
      this.bestSellersLoading = false;
    });
  }

  processProduct(): void {
    this.initializeProduct();

    this.productService.getProductById(this.variantId).subscribe((res: any) => {

      this.product = res.data;

      if (this.product.isExpired
        || (this.product.visibleToSellers.length > 0 && !(this.product.visibleToSellers.includes(this.user._id)))) {
        this.productInvalid = true;
        return;
      } else {
        this.productInvalid = false;
      }

      this.setupProductVariants();

      this.setProductAvailiblity();

      this.formatSelectedProduct();

      this.formatProductDetails();

      this.setupGallery();

      this.selectInitialDetailsSection();

      this.setupNavigationArrowsVisibility();

      this.setupCategoryNavigationQueryParams();

      this.trackMixpanelEvent('product_page_load');

      this.setProductCurrency();

    },
      (err) => {
        this.productInvalid = true;
      });

  }

  getCategoryHeirarchy(): void {
    this.commercialCategoriesService.getCommercialCategoriesTree().subscribe(tree => {
      if (tree) {
        const selectedCategoryId = this.variantGroup.commercialCategoryIds[0];
        const categoryHierarchy = this.commercialCategoriesService.getCategoryHierarchy(tree, selectedCategoryId);
        if (categoryHierarchy.length) {
          this.categoryHierachy = categoryHierarchy;
        }
      }
    });

  };

  initializeProduct(): void {
    this.productImgArr = [];
    this.productVidArr = [];
    this.productVidTypeArr = [];
    this.productDetails = '';
    this.productSpecification = [];
    this.productHowToUse = '';
    this.colorVariantArr = [];
    this.sizeVariantArr = [];
  }

  setupGallery(): void {
    // Adding Product Picture
    this.addMedia(this.product.productPicture);

    // Adding Extra Image if exists
    for (const key in this.product) {
      if (key.includes('extraImage') && this.product[key]) {
        this.addMedia(this.product[key]);
      }
    }

    // Adding Additional Media if exists
    if (this.product.additionalMedia) {
      for (const mediaItem of this.product.additionalMedia) {
        this.addMedia(mediaItem);
      }
    }

    // Adding embedded youtube videos
    if (this.product.embeddedVideos) {
      for (const embeddedVideo of this.product.embeddedVideos) {
        this.addMedia(embeddedVideo);
      }
    }

    this.productImgIdx = 0;
  }

  addMedia(mediaItem): void {
    const mediaType = this.getMediaType(mediaItem);
    if (mediaType === 'youtube') {
      this.productVidArr.push(this.sanitizer.bypassSecurityTrustResourceUrl(mediaItem));
      this.productVidTypeArr.push(mediaType);
    } else if (mediaType === 'img') {
      this.productImgArr.push(mediaItem);
    } else {
      this.productVidArr.push(mediaItem);
      this.productVidTypeArr.push(mediaType);
    }
  }

  formatSelectedProduct() {
    this.selectedProducts = [this.product];
    this.selectedProducts.forEach((product) => {
      product.newPrice = product.productPrice;
      product.selected = true;
      product.id = product._id;
      product.pid = product.prodID;
      product.quantity = this.numberOfItems;
    });
  }

  formatProductDetails() {
    if (this.product.specifications) {
      this.productSpecification = this.product.specifications.replace(/â€¢\s?/g, '').split('\r\n').filter(spec => spec !== '');
      this.productDetails = this.product?.productDescription;
    } else {
      if (this.product?.productDescription) {
        if (this.product?.productDescription.split('-').length > 1) {
          this.productSpecification = this.product?.productDescription.split('-');
        } else {
          this.productDetails = this.product?.productDescription;
        }
      }
    }
    this.productSpecification = this.productSpecification.map(specification => {
      if (this.boldPattern.test(specification)) {
        return { text: specification.replace(this.starRegex, ''), type: 'bold' };
      }
      return { text: specification, type: 'none' };
    });
    this.productHowToUse = this.product.howToUse;
  }

  selectInitialDetailsSection() {
    if (this.productDetails) {
      this.detailsSectionSelected = 'Ø´Ø±Ø­ Ø§Ù„Ù…Ù†ØªØ¬';
    } else if (this.productSpecification.length !== 0) {
      this.detailsSectionSelected = 'ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬';
    } else if (this.productHowToUse !== '') {
      this.detailsSectionSelected = 'ÙƒÙŠÙÙŠØ© Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…';
    } else if (this.productVidTypeArr.length !== 0) {
      this.detailsSectionSelected = 'ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª Ø§Ù„Ù…Ù†ØªØ¬';
    }
  }

  setupNavigationArrowsVisibility(): void {
    if (this.productImgArr.length > 5) {
      this.showNavigationArrows = true;
    }
    if (this.productVidArr.length > 1) {
      this.showVidNavigationArrows = true;
    }
    if (this.productImgArr.length > 1) {
      this.showLargeNavigationArrows = true;
    }
  }

  getVariantIdBySelectedAttributtes() {
    const selectedAttributtes = {
      size: this.selectedSize,
      color: this.selectedColor
    };
    const sameColorVariants = this.variantGroup.variants.filter((variant) => {
      const variantColorAttributes = variant.attributes.filter(attribute => attribute.type === 'color');
      return variantColorAttributes[0] && variantColorAttributes[0].value === selectedAttributtes.color;
    });
    const sameSizeVariants = this.variantGroup.variants.filter((variant) => {
      const variantSizeAttributes = variant.attributes.filter(attribute => attribute.type === 'size');
      return variantSizeAttributes[0] && variantSizeAttributes[0].value === selectedAttributtes.size;
    });
    if (sameColorVariants.length > 0 && selectedAttributtes.size) {
      const variantWithSameColorAndSize = sameColorVariants.filter(
        (variant) => variant.attributes[1].value === selectedAttributtes.size)[0];
      if (variantWithSameColorAndSize) {
        return variantWithSameColorAndSize._id;
      } else {
        return sameColorVariants[0]._id;
      }
    } else if (sameSizeVariants.length > 0) {
      return sameSizeVariants[0]._id;
    } else {
      return sameColorVariants[0]._id;
    }
  }

  goToVariantById(variantId) {
    this.router.navigate(['/product-details', variantId]);
  }

  initializeAllPossibleVariantPairs() {
    this.variantPossibleAttributes = this.variantGroup.variants.map((variant) => {
      const filteredColor = variant.attributes.filter(set => set.type === 'color')[0];
      const filteredSize = variant.attributes.filter(attribute => attribute.type === 'size')[0];
      return {
        color: filteredColor && filteredColor.value,
        size: filteredSize && filteredSize.value,
      };
    });
  }

  resetSizes() {
    const colorPossibleAttributes = this.variantPossibleAttributes.filter(pair => pair.color === this.selectedColor);
    if (colorPossibleAttributes.length > 0) {
      this.sizeVariantArr = colorPossibleAttributes.map(pair => pair.size).filter(
        (_size, index, arr) => _size && arr.indexOf(_size) === index);
    } else {
      this.sizeVariantArr = this.variantPossibleAttributes.filter(pair => pair.size === this.selectedSize).map(pair => pair.size).filter(
        (_size, index, arr) => _size && arr.indexOf(_size) === index);
    }
  }

  onColorVariantAttributeChange(color) {
    this.selectedColor = color;
    this.goToVariantById(this.getVariantIdBySelectedAttributtes());
  }

  onSizeVariantAttributeChange(size) {
    this.selectedSize = size;
    this.goToVariantById(this.getVariantIdBySelectedAttributtes());
  }

  setupProductVariants(): void {
    if (this.variantGroup.attributeSets.length > 0) {
      this.initializeAllPossibleVariantPairs();
      const uniqVariantColors = this.variantPossibleAttributes.map(attribute => attribute.color).filter(
        (_color, index, arr) => _color && arr.indexOf(_color) === index);
      if (uniqVariantColors.length > 0) {
        this.colorVariantArr = uniqVariantColors;
        this.colorNamesArray = this.colorVariantArr.map(color => {
          const filteredArray = COLOR_VARIANTS.filter(colorVariant => colorVariant.color === color);
          return filteredArray.length ? filteredArray[0].arabicColorName : '';
        });
        const filteredColor = this.product.attributes.filter(attribute => attribute.type === 'color')[0];
        this.selectedColor = filteredColor ? filteredColor.value : '';
      }
      this.resetSizes();
      const filteredSize = this.product.attributes.filter(attribute => attribute.type === 'size')[0];
      this.selectedSize = filteredSize ? filteredSize.value : '';
    }
  }

  setupCategoryNavigationQueryParams(): void {
    this.categoryNavigationQueryParams = {
      category: this.product.Category,
      currentPage: 1,
      items: 12,
      sorting: SORT_BY_CREATED_AT,
    };
  }

  getImgSrc(idx: number) {
    return this.productImgArr[idx];
  }

  getVidSrc(idx: number) {
    return this.productVidArr[idx];
  }

  getMediaType(link: string) {
    switch (link.substr(link.lastIndexOf('.') + 1).toLowerCase()) {
      case 'jpg':
      case 'png':
      case 'jpeg':
        return 'img';
      case 'mp4':
      case 'mov':
        return 'vid';
      default:
        return 'youtube';
    }
  }

  onClickRight(): void {
    const lastIdx = this.productImgArr.length - 1;
    if (this.productImgIdx < lastIdx) {
      this.productImgIdx++;
    }
  }

  onClickLeft(): void {
    if (this.productImgIdx > 0) {
      this.productImgIdx--;
    }
  }

  onSelectImage(idx): void {
    this.productImgIdx = idx;
  }

  onChangeNoOfItems(buttonPressed) {
    if (buttonPressed === '+') {
      this.numberOfItems++;
    } else if (buttonPressed === '-') {
      if (this.numberOfItems > 1) {
        this.numberOfItems--;
      }
    }
  }
  addToCart(): void {
    this.trackMixpanelEvent('product_page_click_add_to_cart');
    this.cartService
      .addToCart(this.product._id, this.product.sellerName, this.numberOfItems)
      .subscribe(
        (res: any) => {
          gtag('event', 'add_to_cart', {
            event_label:
              'prodID: ' +
              this.product.prodID +
              ', phoneNum:' +
              this.user.phoneNum +
              ', TagerID:' +
              this.user.TagerID,
          });
          this.toastr.success('ØªÙ… Ø§Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬');
        },
        (err) => {
          // console.log(err);
        }
      );
  }

  orderSubmitted(e): void {
    if (e.status) {
      this.isOrderNow = false;
      this.selectedProducts = [];
      this.processProduct();
      this.toastr.success('ØªÙ… Ø¹Ù…Ù„ Ø§Ù„Ø§ÙˆØ±Ø¯Ø± Ø¨Ù†Ø¬Ø§Ø­');
    } else {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    }
    this.isOrderNow = false;
  }

  orderNow(numberOfItems): void {
    this.product.quantity = numberOfItems;
    this.getPlaceOrderAvailabilityUseCase.execute().subscribe(
      isWithinRange => {
        if (isWithinRange) {
          this.isOrderNow = true;
        } else {
          const msg = this.selectedCountry.isoCode2 === 'EG' ?
            'ØªØ§Ø¬Ø± Ù„Ù† ØªØ³ØªÙ‚Ø¨Ù„ Ø·Ù„Ø¨Ø§Øª Ù…Ù† 4 ÙŠÙˆÙ„ÙŠÙˆ Ù…Ù† Ø§Ù„Ø³Ø§Ø¹Ù‡ 11:59 Ù…Ø³Ø§Ø¡ Ø­ØªÙ‰ 10  ÙŠÙˆÙ„ÙŠÙˆ Ø§Ù„Ø³Ø§Ø¹Ù‡ 9 ØµØ¨Ø§Ø­Ø§' :
            'ØªØ§Ø¬Ø± Ù„Ù† ØªØ³ØªÙ‚Ø¨Ù„ Ø·Ù„Ø¨Ø§Øª Ù…Ù† 4 ÙŠÙˆÙ„ÙŠÙˆ Ù…Ù† Ø§Ù„Ø³Ø§Ø¹Ù‡ 11:59 Ù…Ø³Ø§Ø¡ Ø­ØªÙ‰ 14 ÙŠÙˆÙ„ÙŠÙˆ Ø§Ù„Ø³Ø§Ø¹Ù‡ 9 ØµØ¨Ø§Ø­Ø§';
          this.toastr.error(msg);
        }
      }
    );
    this.trackMixpanelEvent('product_page_click_order_now');
    window.scrollTo(0, 0);
  }

  onDownloadPhotos(): void {
    this.trackMixpanelEvent('product_page_click_download_all_pictures');
    this.productImgArr.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = item;
      link.download = '';
      setTimeout(() => {
        link.click();
        link.remove();
      }, index * 1000);
    });
  }

  reload() {
    this.isOrderNow = false;
    this.selectedProducts = [];
    this.processProduct();
  }

  setProductAvailiblity() {
    this.productAvailiblityStatus = this.product.productAvailability;
    this.inStock = this.productAvailiblityStatus !== 'not_available';
  }

  getColor() {
    if (this.productAvailiblityStatus === 'available_with_high_qty') {
      return '#3dbb54';
    } else if (this.productAvailiblityStatus === 'available') {
      return '#3dbb54';
    } else if (this.productAvailiblityStatus === 'available_with_low_qty') {
      return '#ffae0c';
    } else if (this.productAvailiblityStatus === 'not_available') {
      return '#ff4966';
    } else {
      return '3dbb54';
    }
  }

  mapProductAvailiblity() {
    if (this.productAvailiblityStatus === 'available_with_high_qty') {
      return 'Ù…ØªÙˆÙØ± Ø¨ÙƒÙ…ÙŠØ© ÙƒØ¨ÙŠØ±Ø©';
    } else if (this.productAvailiblityStatus === 'available') {
      return 'Ù…ØªÙˆÙØ±';
    } else if (this.productAvailiblityStatus === 'available_with_low_qty') {
      return 'Ù…ØªÙˆÙØ± Ø¨ÙƒÙ…ÙŠØ© Ù…Ø­Ø¯ÙˆØ¯Ø©';
    } else if (this.productAvailiblityStatus === 'not_available') {
      return 'ØºÙŠØ± Ù…ØªÙˆÙØ±';
    } else {
      return '';
    }
  }

  onSelectDetailsSection(section) {
    this.detailsSectionSelected = section;
  }

  onSelectBestSellerCategory(category: string) {
    this.bestSellersLoading = true;
    this.bestSellerCarouselData.categoryName = category;
    setTimeout(() => {
      this.bestSellersLoading = false;
    }, 0);
  }

  onCatalogProduct(): void {
    if (this.isCataloged) {
      this.trackMixpanelEvent('product_page_click_add_to_catalog');
      this.catalogService.uncatalogProduct(this.variantId).subscribe(
        () => {
          this.getIsCataloged();
          this.toastr.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');


        }, (err) => {
          this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
        }
      );
    } else {
      this.trackMixpanelEvent('product_page_click_remove_from_catalog');
      this.catalogService.catalogProduct(this.variantId).subscribe(
        () => {
          this.getIsCataloged();
          this.toastr.success('ØªÙ… Ø§Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„ÙŠ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');
        }, (err) => {
          this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
        }
      );
    }
  }

  getCatalogedProducts(): void {
    this.catalogService.getCatalogedProducts().subscribe(() => {
      this.isCatalogDataLoaded = true;
    }, () => {
      this.isCatalogDataLoaded = true;
    });
  }

  setProductCurrency(): void {
    const productCountry = this.multitenancyService.getCountryByIsoCode3(this.product.country ? this.product.country : 'EGY');
    this.currency = productCountry.currency.arabicName;
  }

  private trackMixpanelEvent(eventName) {
    let eventProperties: any =
    {
      'User Category': this.user && this.user.loyaltyProgram.loyaltyProgram,
      Language: 'ar',
      'Interface Version': 'v2',
      'Category Id': this.product.categoryId,
      'Category Name': this.product.Category,
      'Product Id': this.product.prodID,
      'Product Name': this.product.productName,
      'Product Price': this.product.productPrice,
      'Product Profit': this.product.productProfit,
      'Product Availability Status': this.product.productQuantityStatus,
      'Is Has Variants': this.product.attributes && this.product.attributes.length > 0,
      'Is Added To Catalog': this.isCataloged,
    };
    if (eventName !== 'product_page_load') {
      eventProperties = { ...eventProperties, 'Is Variant Selected': this.product.prodID !== this.variantGroup.primaryVariant.prodID };
    }
    this.mixpanelService.track(eventName, eventProperties);
  }
}


