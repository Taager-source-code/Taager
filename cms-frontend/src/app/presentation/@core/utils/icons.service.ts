import { Injectable } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import * as GENERIC_ICONS from '../../../../assets/images/generic-icons';
import * as SIDE_MENU_ICONS from '../../../../assets/images/navbar-buttons-icons/side-menu-icons';
@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor(
    private nbIconLibraries: NbIconLibraries,
  ) {
    this.registerTaagerPackIcons();
  }
  registerTaagerPackIcons(): void {
    this.nbIconLibraries.registerSvgPack('taager-icons', {
      'all-products-icon': SIDE_MENU_ICONS.ALL_PRODUCTS_ICON,
      'add-products-icon': SIDE_MENU_ICONS.ADD_PRODUCTS_ICON,
      'commercial-categories-icon': SIDE_MENU_ICONS.COMMERCIAL_CATEGORIES_ICON,
      'internal-categories-icon': SIDE_MENU_ICONS.INTERNAL_CATEGORIES_ICON,
      'category-edit-icon': GENERIC_ICONS.CATEGORY_EDIT_ICON,
      'sub-category-edit-icon': GENERIC_ICONS.SUB_CATEGORY_EDIT_ICON,
      'category-delete-icon': GENERIC_ICONS.CATEGORY_DELETE_ICON,
      'sub-category-delete-icon': GENERIC_ICONS.SUB_CATEGORY_DELETE_ICON,
      'feature-category-icon': GENERIC_ICONS.FEATURE_CATEGORY_ICON,
      'red-trash-icon': GENERIC_ICONS.RED_TRASH_ICON,
      'bundles-icon': GENERIC_ICONS.BUNDLES_ICON,
    });
  }
}
