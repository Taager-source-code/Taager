import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { SubBannerDataInterface } from 'src/app/presentation/shared/interfaces/product.interafce';
import { SORT_BY_CREATED_AT } from 'src/app/presentation/shared/constants/category-products';
import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';
import { FEATURE_FLAGS } from 'src/app/presentation/shared/constants';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sub-banner',
  templateUrl: './sub-banner.component.html',
  styleUrls: ['./sub-banner.component.scss']
})
export class SubBannerComponent implements OnInit {

  @Input() bannerData: SubBannerDataInterface;

  public commercialCategoriesFeatureFlag = false;
  public queryParams;

  constructor(
    private getFeatureFlagUseCase: GetFeatureFlagUsecase,

  ) { }

  ngOnInit(): void {
    if (!isDevMode()) {
      this.getFeatureFlagUseCase.execute(FEATURE_FLAGS.COMMERCIAL_CATEGORIES_FLAG).subscribe((flag) => {
        this.commercialCategoriesFeatureFlag = flag;
      });
    } else {
      this.commercialCategoriesFeatureFlag = true;
    }
    this.queryParams = {
      currentPage: 1,
      items: 12,
      sorting: SORT_BY_CREATED_AT,
    };
    if (!this.commercialCategoriesFeatureFlag) {
      this.queryParams.category = this.bannerData.categoryName;
    }
  }
}


