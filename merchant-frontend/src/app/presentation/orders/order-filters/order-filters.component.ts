import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ORDER_STATUSES } from 'src/app/presentation/shared/constants';
import { Country } from 'src/app/presentation/shared/interfaces/countries';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.scss']
})
export class OrderFiltersComponent implements OnInit {
  public orderSearchFilterForm: FormGroup;
  public countries: Country[];
  public isMultitenancyEnabled: boolean;
  public orderStatuses;
  public childOrderStatuses;

  @Input() filterObject: {
    orderId: string;
    taagerId: string;
    fromDate: string;
    toDate: string;
    country: string;
  };
  @Input() resetTriggered: Subject<boolean>;
  @Input() isChildOrderTabActive: boolean;
  @Output() searchTriggered: EventEmitter<any> = new EventEmitter();

  constructor(
    private multitenancyService: MultitenancyService,
  ) {
    this.orderSearchFilterForm = new FormGroup({
      searchKey: new FormControl(null),
      status: new FormControl(null),
      orderId: new FormControl(null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      country: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.setupMultitenancy();
    this.setupOrderStatuses();
    this.resetTriggered.subscribe(() => {
      this.orderSearchFilterForm.reset();
    });
  }

  onClickSearchButton(): void {
    const searchKey = this.orderSearchFilterForm.value.searchKey;
    if(searchKey) {
      this.orderSearchFilterForm.reset();
      this.orderSearchFilterForm.get('searchKey').setValue(searchKey);
    }
    this.searchTriggered.emit(this.orderSearchFilterForm.value);
  }

  setupMultitenancy(): void {
    this.multitenancyService.getSupportedCountries().then(supportedCountries => {
      this.countries = supportedCountries;
    });
    this.isMultitenancyEnabled = this.multitenancyService.isMultitenancyEnabled();
  }

  setupOrderStatuses(): void {
    this.orderStatuses = ORDER_STATUSES.ALL_STATUSES.filter(status => ORDER_STATUSES.ORDERS_FILTER_OPTIONS.includes(status.statusInEnglish));
    this.childOrderStatuses = ORDER_STATUSES.ALL_STATUSES.filter(status => ORDER_STATUSES.CHILD_ORDERS_FILTER_OPTIONS.includes(status.statusInEnglish));
  }

  onClearFilters(): void {
    this.orderSearchFilterForm.reset();
    this.searchTriggered.emit(this.orderSearchFilterForm.value);
  }

}


