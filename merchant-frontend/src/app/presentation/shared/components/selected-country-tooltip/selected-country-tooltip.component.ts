import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { CART_URL, CATALOG_URL } from '../../constants';

import { Country } from '../../interfaces/countries';

import { MultitenancyService } from '../../services/multitenancy.service';

@Component({

  selector: 'app-selected-country-tooltip',

  templateUrl: './selected-country-tooltip.component.html',

  styleUrls: ['./selected-country-tooltip.component.scss']

})

export class SelectedCountryTooltipComponent implements OnInit {

  multiTenancyFlag: boolean;

  selectedCountry: Country;

  tooltipText: string;

  constructor(

    private router: Router,

    private multitenancyService: MultitenancyService,

  ) {

    this.multiTenancyFlag = this.multitenancyService.isMultitenancyEnabled();

  }

  ngOnInit(): void {

    this.selectedCountry = this.multitenancyService.getCurrentCountry();

    this.tooltipText = this.getTooltipText();

  }

  getTooltipText(): string {

    switch(this.router.url) {

      case CATALOG_URL:

        return 'انت الان تشاهد الكتالوج الخاص ب';

      case CART_URL:

        return 'انت الان تشاهد العربة الخاصة بالشحن الي ';

      default:

        return 'انت الان تشاهد الصفحه الخاصة ب ';

    }

  }

}
