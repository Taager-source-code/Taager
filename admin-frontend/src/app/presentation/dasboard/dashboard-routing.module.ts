import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import {
  OrderCompletionDialogComponent,
  OrderRefundsDialogComponent,
  OrderReplacementsDialogComponent,
} from "@taager-webapp/web-components";
import { GALLERY_CONFIG } from "ng-gallery";
import { AngularModule } from "../angular.module";
import { ChangePasswordComponent } from "../auth/change-password/change-password.component";
import { WelcomeMessageComponent } from "../auth/welcome-message/welcome-message.component";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { ThirdPartyModule } from "../third-party.module";
import { OrderItemDialogComponent } from "./account/orders/order-item-dialog/order-item-dialog.component";
import { AddAnnouncementComponent } from "./admin/add-announcement/add-announcement.component";
import { AddDeliveryPackageComponent } from "./admin/add-delivery-package/add-delivery-package.component";
import { AddProvinceComponent } from "./admin/add-province/add-province.component";
import { AdminComponent } from "./admin/admin.component";
import { AssignOrdersComponent } from "./admin/assign-orders/assign-orders.component";
import { BulkUploadTrackingIdComponent } from "./admin/bulk-upload-tracking-id/bulk-upload-tracking-id.component";
import { CalculateProfitDialogComponent } from "./admin/calculate-profit-dialog/calculate-profit-dialog.component";
import { ChangeChildOrderStatusDialogComponent } from "./admin/change-child-order-status-dialog/change-child-order-status-dialog.component";
import { ChangeOrderProductsPriceComponent } from "./admin/change-order-products-price/change-order-products-price.component";
import { ChangeOrderStatusDialogComponent } from "./admin/change-order-status-dialog/change-order-status-dialog.component";
import { ConfirmFileUploadDialogComponent } from "./admin/confirm-file-upload-dialog/confirm-file-upload-dialog.component";
import { CreateOrderIssuesComponent } from "./admin/create-order-issues/create-order-issues.component";
import { CreateSurveyDialogComponent } from "./admin/create-survey-dialog/create-survey-dialog.component";
import { EditFeaturedDialogComponent } from "./admin/edit-featured-dialog/edit-featured-dialog.component";
import { EditSurveyDialogComponent } from "./admin/edit-survey-dialog/edit-survey-dialog.component";
import { EditUserRoleComponent } from "./admin/edit-user-role/edit-user-role.component";
import { ExportOrdersStatusComponent } from "./admin/export-orders-status/export-orders-status.component";
import { ExtractUsersDialogComponent } from "./admin/extract-users-dialog/extract-users-dialog.component";
import { GeneratePickListDialogComponent } from "./admin/generate-pick-list-dialog/generate-pick-list-dialog.component";
import { MergeableOrderDialogComponent } from "./admin/mergeable-order-dialog/mergeable-order-dialog.component";
import { NotificationDialogComponent } from "./admin/notification-dialog/notification-dialog.component";
import { OrderDataDialogComponent } from "./admin/order-data-dialog/order-data-dialog.component";
import { OrderIssueDialogComponent } from "./admin/order-issue-dialog/order-issue-dialog.component";
import { RejectOrderDialogComponent } from "./admin/reject-order-dialog/reject-order-dialog.component";
import { RejectRequestDialogComponent } from "./admin/reject-request-dialog/reject-request-dialog.component";
import { RevertStatusComponent } from "./admin/revert-status/revert-status.component";
import { ShippingBulkChildOrdersComponent } from "./admin/shipping-bulk-child-orders/shipping-bulk-child-orders.component";
import { ShippingBulkOrdersComponent } from "./admin/shipping-bulk-orders/shipping-bulk-orders.component";
import { UserFeaturesDialogComponent } from "./admin/user-features-dialog/user-features-dialog.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { OrderAdminChatComponent } from "./order/order-admin-chat/order-admin-chat.component";
import { OrderChatComponent } from "./order/order-chat/order-chat.component";
import { CardItemComponent } from "./products/card-item/card-item.component";
import { ItemCarouselComponent } from "./products/item-carousel/item-carousel.component";
import { ProductsComponent } from "./products/products.component";
import { CartService } from "./services/cart.service";
import { HttpRequestInterceptor } from "./services/HttpRequestInterceptor.service";
import { OrderService } from "./services/order.service";
import { ProfileService } from "./services/profile.service";
import { SurveyService } from "./services/survey.service";
import { PaymentRequestComponent } from "./wallet/payment-request/payment-request.component";
@NgModule({
  declarations: [
    AdminComponent,
    CreateOrderIssuesComponent,
    BulkUploadTrackingIdComponent,
    ChangePasswordComponent,
    RejectRequestDialogComponent,
    RejectOrderDialogComponent,
    ChangeOrderStatusDialogComponent,
    ChangeChildOrderStatusDialogComponent,
    OrderChatComponent,
    OrderAdminChatComponent,
    AddAnnouncementComponent,
    ExportOrdersStatusComponent,
    AddProvinceComponent,
    WelcomeMessageComponent,
    OrderDataDialogComponent,
    CalculateProfitDialogComponent,
    ChangeOrderProductsPriceComponent,
    OrderItemDialogComponent,
    RevertStatusComponent,
    ExtractUsersDialogComponent,
    AddDeliveryPackageComponent,
    ShippingBulkOrdersComponent,
    UserFeaturesDialogComponent,
    NotificationDialogComponent,
    AssignOrdersComponent,
    MergeableOrderDialogComponent,
    EditUserRoleComponent,
    PaymentRequestComponent,
    ProductsComponent,
    CardItemComponent,
    ItemCarouselComponent,
    OrderIssueDialogComponent,
    ShippingBulkChildOrdersComponent,
    CreateSurveyDialogComponent,
    EditSurveyDialogComponent,
    EditFeaturedDialogComponent,
    GeneratePickListDialogComponent,
    ConfirmFileUploadDialogComponent,
  ],
  entryComponents: [
    BulkUploadTrackingIdComponent,
    ChangePasswordComponent,
    RejectRequestDialogComponent,
    RejectOrderDialogComponent,
    ChangeOrderStatusDialogComponent,
    ChangeChildOrderStatusDialogComponent,
    OrderChatComponent,
    OrderAdminChatComponent,
    AddAnnouncementComponent,
    ExportOrdersStatusComponent,
    AddProvinceComponent,
    WelcomeMessageComponent,
    OrderDataDialogComponent,
    CalculateProfitDialogComponent,
    ChangeOrderProductsPriceComponent,
    OrderItemDialogComponent,
    RevertStatusComponent,
    ExtractUsersDialogComponent,
    AddDeliveryPackageComponent,
    ShippingBulkOrdersComponent,
    UserFeaturesDialogComponent,
    NotificationDialogComponent,
    AssignOrdersComponent,
    MergeableOrderDialogComponent,
    EditUserRoleComponent,
    PaymentRequestComponent,
    ProductsComponent,
    CardItemComponent,
    ItemCarouselComponent,
    OrderIssueDialogComponent,
    ShippingBulkChildOrdersComponent,
    CreateSurveyDialogComponent,
    EditSurveyDialogComponent,
    EditFeaturedDialogComponent,
    GeneratePickListDialogComponent,
    ConfirmFileUploadDialogComponent,
    OrderRefundsDialogComponent,
    OrderReplacementsDialogComponent,
    OrderCompletionDialogComponent,
  ],
  imports: [
    CommonModule,
    AngularModule,
    SharedModule,
    MaterialModule,
    ThirdPartyModule,
    DashboardRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    CartService,
    OrderService,
    ProfileService,
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: true,
        imageSize: "cover",
      },
    },
    SurveyService,
  ],
})
export class DashboardModule {}
