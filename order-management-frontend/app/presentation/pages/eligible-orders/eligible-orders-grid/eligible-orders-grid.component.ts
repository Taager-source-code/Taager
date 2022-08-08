import { Component, Input, ViewChild } from '@angular/core';
import { CountryModel } from '@core/domain/country.model';
import { OrderDetailsModel, OrderModel } from '@core/domain/order.model';
import { OM_AFTER_SALES_REQUESTS } from '@data/constants/feature-flags';
import { MyToastService } from '@presentation/@core/utils/myToast.service';
import { RemoteConfigService } from '@presentation/services/remote-config.service';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
@Component({
  selector: 'ngx-eligible-orders-grid',
  templateUrl: './eligible-orders-grid.component.html',
  styleUrls: ['./eligible-orders-grid.component.scss'],
})
export class EligibleOrdersGridComponent {
  @Input() selectedOrder: OrderModel;
  @Input() selectedCountry: CountryModel;
  @ViewChild('afterSales') afterSalesSidebar: SidebarComponent;
  selectedOrderLine: OrderDetailsModel = null;
  constructor(
    private toast: MyToastService,
    private remoteConfigService: RemoteConfigService,
  ) { }
  copySKU(SKU: string): void {
    navigator.clipboard.writeText(SKU);
    this.toast.showToast('Copied', 'SKU Copied', 'success');
  }
  openAfterSalesSidebar(orderLine: OrderDetailsModel): void {
    this.remoteConfigService.getFeatureFlags(OM_AFTER_SALES_REQUESTS).subscribe(flag => {
      if(flag) {
        this.selectedOrderLine = orderLine;
        this.afterSalesSidebar.show();
      }
    });
  }
  closeAfterSalesSideBar(): void {
    this.selectedOrderLine = null;
    this.afterSalesSidebar.hide();
  }
}