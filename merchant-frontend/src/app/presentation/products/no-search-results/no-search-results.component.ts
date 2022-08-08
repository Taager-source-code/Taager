/* eslint-disable @typescript-eslint/naming-convention */
import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';
import { ALL_PRODUCTS_CATEGORY, FEATURE_FLAGS, TAAGER_EXCLUSIVE_OFFFERS_CATEGORY } from '../../shared/constants';
import { CategoryInterface } from '../../shared/interfaces/product.interafce';
import { User } from '../../shared/interfaces/user.interface';
import { CategoryService } from '../../shared/services/category.service';
import { CommercialCategoriesService } from '../../shared/services/commercial-categories.service';
import { IconsService } from '../../shared/services/icons.service';
import { InternetCheckService } from '../../shared/services/internetCheck.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { MixpanelService } from '../../shared/services/mixpanel.service';

@Component({
  selector: 'app-no-search-results',
  templateUrl: './no-search-results.component.html',
  styleUrls: ['./no-search-results.component.scss'],
  providers: [CommercialCategoriesService]
})
export class NoSearchResultsComponent implements OnInit {
  user: User;
  searchKey = '';
  isCategoriesIconsLoaded = false;
  isInternetWorking = true;
  categories: CategoryInterface[];
  public commercialCategoriesFeatureFlag = false;

  constructor(
    private route: ActivatedRoute,
    private iconsService: IconsService,
    private categoryService: CategoryService,
    private mixpanelService: MixpanelService,
    private localStorageService: LocalStorageService,
    private getFeatureFlagUseCase: GetFeatureFlagUsecase,
    private commercialCategoriesService: CommercialCategoriesService,
    private internetCheckService: InternetCheckService
  ) { }

  ngOnInit(): void {
    if (!isDevMode()) {
      this.getFeatureFlagUseCase.execute(FEATURE_FLAGS.COMMERCIAL_CATEGORIES_FLAG).subscribe((flag) => {
        this.commercialCategoriesFeatureFlag = flag;
        this.getCategories();

      });
    } else {
      this.commercialCategoriesFeatureFlag = true;
      this.getCategories();
    }
    this.getSearchKey();
    this.getUser();
  }

  getSearchKey(): void {
    this.internetCheckService.createOnline$().subscribe(
      (res)=> {
        this.isInternetWorking = res;
      });
    this.route.queryParams.subscribe((params: Params) => {
      this.searchKey = params.searchKey || '';
    });
  }

  getUser(): void {
    this.user = this.localStorageService.getUser();
  }

  trackNoSearchResultsEvent(): void {
    const eventBody = {
      'Search Text': this.searchKey ?? '',
      'User Category': this.user.loyaltyProgram?.loyaltyProgram ?? 'N/A',
      Language: 'ar',
      'Interface Version': 'v2',
    };
    this.mixpanelService.track('No_results_page_load', eventBody);
  }

  getCategories(): void {
    if (this.commercialCategoriesFeatureFlag) {
      this.commercialCategoriesService.getCommercialCategoriesTree().subscribe(tree => {
        this.categories = tree.root.children.map(
          child => {
            const category: CategoryInterface = {
              name: child.value.name.arabicName,
              text: child.value.name.arabicName,
              _id: child.key,
              featured: child.value.featured
            };
            return category;
          });
      });
    } else {
      this.categoryService.getCategories().subscribe(res => {
        this.categories = res.data.filter(
          category => category.text !== ALL_PRODUCTS_CATEGORY && category.text !== TAAGER_EXCLUSIVE_OFFFERS_CATEGORY);
        this.setCategoriesIcons(res.data);
      });
    }
  }

  setCategoriesIcons(categories: CategoryInterface[]): void {
    this.iconsService.initializeCategoryIcons(categories).finally(() => {
      this.isCategoriesIconsLoaded = true;
    });
  }

}


