import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { ConfirmDeleteItemComponent } from './confirm-delete-item/confirm-delete-item.component';
import { CartComponent } from './cart.component';
import { SuccessOrderModalComponent } from './success-order-modal/success-order-modal.component';
import { SharedModule } from '../shared/shared.module';
import { BulkOrdersComponent } from './bulk-orders/bulk-orders.component';

@NgModule({
  declarations: [
    CartComponent,
    BulkOrdersComponent,
    SuccessOrderModalComponent,
    ConfirmDeleteItemComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CartRoutingModule
  ],
})
export class CartModule { }


