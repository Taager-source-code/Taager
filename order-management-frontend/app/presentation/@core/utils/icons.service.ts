import { Injectable } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import * as CUSTOM_ICONS from '../../../../assets/icons/custom-icons';
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
      'dashboard-icon': CUSTOM_ICONS.DASHBOARD_ICON,
      'orders-icon': CUSTOM_ICONS.ORDERS_ICON,
      'batches-icon': CUSTOM_ICONS.BATCHES_ICON,
      'shipping-capacity-icon': CUSTOM_ICONS.SHIPPING_CAPACITY_ICON,
      'bulk-shipping-icon': CUSTOM_ICONS.BULK_SHIPPING_ICON,
      'shipping-box-icon': CUSTOM_ICONS.SHIPPING_BOX_ICON,
      'delivery-truck-icon': CUSTOM_ICONS.DELIVERY_TRUCK_ICON,
      'copy-icon': CUSTOM_ICONS.COPY_ICON,
    });
  }
}
