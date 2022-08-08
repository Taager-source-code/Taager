import { NbMenuItem } from '@nebular/theme';
export const ADD_PRODUCTS_MENU_ITEM_TITLE = 'Add Products';
export const INTERNAL_CATEGORIES_MENU_ITEM_TITLE = 'Internal Categories';
export const COMMERCIAL_CATEGORIES_MENU_ITEM_TITLE = 'Commercial Categories';
export const CMS_BUNDLES_MENU_ITEM_TITLE = 'Bundles';
export const ADD_PRODUCTS_MENU_BUTTON: NbMenuItem = {
  title: ADD_PRODUCTS_MENU_ITEM_TITLE,
  icon: {
    icon: 'add-products-icon',
    pack: 'taager-icons',
  },
  badge: {
    text: '>',
    status: 'primary',
  },
};
export const INTERNAL_CATEGORIES_MENU_BUTTON = {
  title: INTERNAL_CATEGORIES_MENU_ITEM_TITLE,
  icon: {
    pack: 'taager-icons',
    icon: 'commercial-categories-icon',
  },
  badge: {
    text: '>',
    status: 'primary',
  },
};
export const COMMERCIAL_CATEGORIES_MENU_BUTTON = {
  title: COMMERCIAL_CATEGORIES_MENU_ITEM_TITLE,
  icon: {
    icon: 'internal-categories-icon',
    pack: 'taager-icons',
  },
  badge: {
    text: '>',
    status: 'primary',
  },
};
export const BUNDLES_MENU_BUTTON = {
  title: CMS_BUNDLES_MENU_ITEM_TITLE,
  icon: {
    icon: 'bundles-icon',
    pack: 'taager-icons',
  },
  link: '/pages/bundles',
  home: true,
};
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'All Products',
    icon: {
      icon: 'all-products-icon',
      pack: 'taager-icons',
    },
    link: '/pages/products',
    home: true,
  },
];
