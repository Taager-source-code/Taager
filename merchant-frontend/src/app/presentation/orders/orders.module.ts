import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import { ChildOrderItemDialogComponent } from './child-order-item-dialog/child-order-item-dialog.component';
import { OrderCompletionComponent } from './order-completion/order-completion.component';
import { OrderItemDialogComponent } from './order-item-dialog/order-item-dialog.component';
import { OrderRefundsComponent } from './order-refunds/order-refunds.component';
import { OrderReplacementsComponent } from './order-replacements/order-replacements.component';
import { RatingBarComponent } from './rating-bar/rating-bar.component';
import { RefundsPolicyDialogComponent } from './refunds-policy-dialog/refunds-policy-dialog.component';
import { TrackOrdersDialogComponent } from './track-orders-dialog/track-orders-dialog.component';
import { OrdersComponent } from './orders.component';
import { CancelOrderIssueDialogComponent } from './cancel-order-issue-dialog/cancel-order-issue-dialog.component';
import { ChildOrderOverviewComponent } from './child-order-overview/child-order-overview.component';
import { OrderFiltersComponent } from './order-filters/order-filters.component';


@NgModule({
  declarations: [
    CancelOrderDialogComponent,
    ChildOrderItemDialogComponent,
    OrderCompletionComponent,
    OrderItemDialogComponent,
    OrderRefundsComponent,
    OrderReplacementsComponent,
    RatingBarComponent,
    RefundsPolicyDialogComponent,
    TrackOrdersDialogComponent,
    OrdersComponent,
    CancelOrderIssueDialogComponent,
    ChildOrderOverviewComponent,
    OrderFiltersComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
  ],
})
export class OrdersModule { }


