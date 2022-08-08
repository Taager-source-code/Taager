import { Component, OnInit, ViewChild } from '@angular/core';
import { NbMenuService, NbMenuItem } from '@nebular/theme';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { RemoteConfigService } from '../@core/utils';
import * as PAGES_MENU_DATA from './pages-menu';
import * as FEATURE_FLAGS from '../@core/contstants/feature-flags';
import { IconsService } from '../@core/utils/icons.service';
import { InternalCategoryModel } from '../../core/domain/internal-category.model';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { CommercialCategoryModel } from '@core/domain/commercial-category.model';
import { TrackEventTrackingUseCase } from '@core/usecases/event-tracking/track-event-tracking.usecase';
import packageInfo from '../../../../package.json';
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl: './pages.component.html',
})
export class PagesComponent implements OnInit{
  @ViewChild('productDialogSidebar') productDialogSidebar: SidebarComponent;
  @ViewChild('internalCategoriesSidebar') internalCategoriesSidebar: SidebarComponent;
  @ViewChild('commercialCategoriesSidebar') commercialCategoriesSidebar: SidebarComponent;
  @ViewChild('editInternalCategorySidebar') editInternalCategorySidebar: SidebarComponent;
  @ViewChild('editCommercialCategorySidebar') editCommercialCategorySidebar: SidebarComponent;
  menu: NbMenuItem[];
  editedInternalCategory: InternalCategoryModel | null;
  editedCommercialCategory: CommercialCategoryModel | null;
  appVersion: string;
  constructor(
    private nbMenuService: NbMenuService,
    private iconsService: IconsService,
    private remoteConfigService: RemoteConfigService,
    private productsService: ProductsService,
    private trackEventTrackingUseCase: TrackEventTrackingUseCase,
  ) {
    this.subscribeToMenuItemsClick();
    this.registerSVGsToEvaIcons();
    this.onEditProduct();
    this.appVersion =  packageInfo.version;
  }
  ngOnInit(): void {
    this.trackEventTrackingUseCase.execute({
      eventName: 'cms_page_view',
    });
    this.menu = PAGES_MENU_DATA.MENU_ITEMS;
    this.remoteConfigService.getFeatureFlags(FEATURE_FLAGS.CMS_ADD_PRODUCT).subscribe(flag => {
      if(flag) {
        this.menu.push(PAGES_MENU_DATA.ADD_PRODUCTS_MENU_BUTTON);
      }
    });
    this.remoteConfigService.getFeatureFlags(FEATURE_FLAGS.CMS_INTERNAL_CATEGORIES).subscribe(flag => {
      if(flag) {
        this.menu.push(PAGES_MENU_DATA.INTERNAL_CATEGORIES_MENU_BUTTON);
      }
    });
    this.remoteConfigService.getFeatureFlags(FEATURE_FLAGS.CMS_COMMERCIAL_CATEGORIES).subscribe(flag => {
      if(flag) {
        this.menu.push(PAGES_MENU_DATA.COMMERCIAL_CATEGORIES_MENU_BUTTON);
      }
    });
    this.remoteConfigService.getFeatureFlags(FEATURE_FLAGS.CMS_BUNDLES).subscribe(flag => {
      if(flag) {
        this.menu.push(PAGES_MENU_DATA.BUNDLES_MENU_BUTTON);
      }
    });
  }
  subscribeToMenuItemsClick(): void {
    this.nbMenuService.onItemClick().subscribe(clickedItem => {
      switch(clickedItem.item.title) {
        case PAGES_MENU_DATA.ADD_PRODUCTS_MENU_ITEM_TITLE:
          this.productDialogSidebar.show();
          break;
        case PAGES_MENU_DATA.INTERNAL_CATEGORIES_MENU_ITEM_TITLE:
          this.internalCategoriesSidebar.show();
          break;
        case PAGES_MENU_DATA.COMMERCIAL_CATEGORIES_MENU_ITEM_TITLE:
          this.commercialCategoriesSidebar.show();
          break;
        default:
          break;
      }
    });
  }
  registerSVGsToEvaIcons(): void {
    this.iconsService.registerTaagerPackIcons();
  }
  onEditInternalCategoryClicked(internalCategory: InternalCategoryModel): void {
    this.internalCategoriesSidebar.hide();
    this.editedInternalCategory = internalCategory;
    this.editInternalCategorySidebar.show();
  }
  onEditCommercialCategoryClicked(commercialCategory: CommercialCategoryModel): void {
    this.commercialCategoriesSidebar.hide();
    this.editedCommercialCategory = commercialCategory;
    this.editCommercialCategorySidebar.show();
  }
  onNavigateToInternalCategories(): void {
    this.editInternalCategorySidebar.hide();
    this.editedInternalCategory = null;
    this.internalCategoriesSidebar.show();
  }
  onNavigateToCommercialCategories(): void {
    this.editCommercialCategorySidebar.hide();
    this.editedCommercialCategory = null;
    this.commercialCategoriesSidebar.show();
  }
  onEditProduct(): void {
    this.productsService.editedVariantGroupId.subscribe(variantGroupId => {
      if(variantGroupId) {
        this.productDialogSidebar.show();
      }
    });
  }
  onCloseProductDialog(): void {
    this.productDialogSidebar.hide();
    this.productsService.clearEditedVariantGroupId();
    this.productsService.initializeForm();
    this.productsService.setSelectedCountryCode(this.productsService.selectedCountryCode);
  }
}
