/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CategoryInterface } from 'src/app/presentation/shared/interfaces/product.interafce';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { SORT_BY_CREATED_AT } from 'src/app/presentation/shared/constants/category-products';
import { CATEGORY_PRODUCTS_URL } from 'src/app/presentation/shared/constants';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {
  @Input() category: CategoryInterface;
  @Input() areIconsLoaded: boolean;
  @Input() cardLocation = 'products-v2';

  navigationRoute;
  navigationQueryParams;
  deviceInfo = null;

  constructor(
    private mixpanelService: MixpanelService,
    private deviceService: DeviceDetectorService,
    private localStorageService: LocalStorageService,
  ) {
    this.detectDevice();
  }

  ngOnInit(): void {
    // eslint-disable-next-line no-underscore-dangle
    this.navigationRoute = [CATEGORY_PRODUCTS_URL, this.category._id];
    this.navigationQueryParams = {
      category: this.category.text,
      currentPage: 1,
      items: 12,
      sorting: SORT_BY_CREATED_AT,
    };
  }

  detectDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  goToCategory(): void {
    if(this.cardLocation === 'products-v2') {
      this.mixpanelService.track('Go_to_category', {
        'Category Name': this.category,
        device: this.deviceInfo.device,
        deviceType: this.deviceInfo.deviceType,
        orientation: this.deviceInfo.orientation,
        operatingSystem: this.deviceInfo.os_version,
        userAgent: this.deviceInfo.userAgent,
      });
    } else if (this.cardLocation === 'no-search-results') {
      const user = this.localStorageService.getUser();
      this.mixpanelService.track('No_results_page_click_category', {
        'User Category': user.loyaltyProgram ? user.loyaltyProgram?.loyaltyProgram : 'N/A',
        Language: 'ar',
        'Interface Version': 'v2',
        // eslint-disable-next-line no-underscore-dangle
        'Category Id': this.category._id,
        'Category Name': this.category.name,
      });
    }
  }
}


