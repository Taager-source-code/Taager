import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "../services/profile.service";
import { ProvinceService } from "../services/province.service";
import { UserService } from "../services/user.service";
import { OrderService } from "../services/order.service";
import { ProductService } from "../services/product.service";
import { SurveyService } from "../services/survey.service";
import { RejectRequestDialogComponent } from "./reject-request-dialog/reject-request-dialog.component";
import { RejectOrderDialogComponent } from "./reject-order-dialog/reject-order-dialog.component";
import { AddProvinceComponent } from "./add-province/add-province.component";
import { PaymentRequestComponent } from "../wallet/payment-request/payment-request.component";
import { ChangeOrderStatusDialogComponent } from "./change-order-status-dialog/change-order-status-dialog.component";
import { ChangeChildOrderStatusDialogComponent } from "./change-child-order-status-dialog/change-child-order-status-dialog.component";
import { FormGroup, FormControl } from "@angular/forms";
import { OrderChatComponent } from "../order/order-chat/order-chat.component";
import { Router } from "@angular/router";
import { AddAnnouncementComponent } from "./add-announcement/add-announcement.component";
import { ExportOrdersStatusComponent } from "./export-orders-status/export-orders-status.component";
import { OrderDataDialogComponent } from "./order-data-dialog/order-data-dialog.component";
import { CalculateProfitDialogComponent } from "./calculate-profit-dialog/calculate-profit-dialog.component";
import { Categories } from "../products/products.component";
import { ChangeOrderProductsPriceComponent } from "./change-order-products-price/change-order-products-price.component";
import { RevertStatusComponent } from "./revert-status/revert-status.component";
import { ExtractUsersDialogComponent } from "./extract-users-dialog/extract-users-dialog.component";
import { UserFeaturesDialogComponent } from "./user-features-dialog/user-features-dialog.component";
import { NotificationDialogComponent } from "./notification-dialog/notification-dialog.component";
import { ShippingBulkOrdersComponent } from "./shipping-bulk-orders/shipping-bulk-orders.component";
import { OrderItemDialogComponent } from "../account/orders/order-item-dialog/order-item-dialog.component";
import { AssignOrdersComponent } from "./assign-orders/assign-orders.component";
import { MergeableOrderDialogComponent } from "./mergeable-order-dialog/mergeable-order-dialog.component";
import { EditUserRoleComponent } from "./edit-user-role/edit-user-role.component";
import { OrderIssueDialogComponent } from "./order-issue-dialog/order-issue-dialog.component";
import { OrderAdminChatComponent } from "../order/order-admin-chat/order-admin-chat.component";
import { UtilityService } from "../services/utility.service";
import { ChangeDetectorRef } from "@angular/core";
import { ShippingService } from "../services/shipping.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ShippingBulkChildOrdersComponent } from "./shipping-bulk-child-orders/shipping-bulk-child-orders.component";
import { CreateSurveyDialogComponent } from "./create-survey-dialog/create-survey-dialog.component";
import { EditSurveyDialogComponent } from "./edit-survey-dialog/edit-survey-dialog.component";
import { environment } from "src/environments/environment";
import { EditFeaturedDialogComponent } from "./edit-featured-dialog/edit-featured-dialog.component";
import { GeneratePickListDialogComponent } from "./generate-pick-list-dialog/generate-pick-list-dialog.component";
import {
  LOCALSTORAGE_USERNAME_KEY,
  ORDER_SOURCE_OPTIONS,
} from "../../shared/constants/index";
import {
  VariantGroupListFilter,
  VariantGroupListItem,
} from "../../shared/interfaces/variant";
// import and declare moment
import * as moment from "moment";
import { CountryDropdownComponent } from "../../shared/country-dropdown/country-dropdown.component";
import { SharedService } from "../../shared/services/shared.service";
import { BulkUploadTrackingIdComponent } from "./bulk-upload-tracking-id/bulk-upload-tracking-id.component";
import { RemoteConfigService } from "../../shared/services/remote-config.service";
import { PaymentWithdrawalsRepository } from "../../shared/repos/payment-withdrawals.repository";
import { CMS_ADMINS_ID_LIST } from "../../shared/constants/cms";
import { MixpanelService } from "../../shared/services/mixpanel.service";

interface IUserPrivileges {
  admin: boolean;
  viewOrders: boolean;
  viewAndEditMessages: boolean;
  confirmOrders: boolean;
  assignOrders: boolean;
  editOrders: boolean;
  verifyOrder: boolean;
  viewAndEditCategory: boolean;
  viewUsers: boolean;
  viewUserWallets: boolean;
  viewAndEditPayments: boolean;
  orderIssues: boolean;
  viewAndEditProvinces: boolean;
}

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  providers: [CountryDropdownComponent],
})
export class AdminComponent implements OnInit {
  public momentObj: any = moment;
  public products: VariantGroupListItem[] = [];
  public provinces = [];
  public roles = [];
  public paymentRequests = [];
  public inProgRequests = [];
  public inProgressOrders = [];
  public pendingRequests = [];
  public pendingOrders = [];
  public allOrders = [];
  public allChildOrders = [];
  public allOrdersExtract = [];
  public users = [];
  public adminUsers = [];
  public selectedOrders = [];
  public isSelected = false;
  public isChecked: boolean;
  public orderStatusList = [];
  public assignedOrdersList = [];
  public allOrdersWithMessages = [];
  public allOrdersWithUnreadMessages = [];
  public assignedOrdersCount: number = 0;
  public taggerCounts = [];
  public firstName: string;
  public lastName: string;
  public email: string;
  public phoneNumber: string;
  public username: string;
  public userId: string;
  public createdAt;
  public userLevel: number;
  isDevEnv = !environment.production;
  public succesfulOrdersNo: number;
  public numberOfPendingOrders: number;
  public numberOfOrders: number;
  public maxItemPerPage = 25;
  public page: 1;
  public maxPageSize = 6;
  public currentPage = 1;
  public profilePicture;
  public userCollection = [];
  public showPagination: boolean;
  public noOfItems: number;
  public selectedIndex = 0;
  public loading = true;
  public showBoundaryLinks = true;
  public orderSearchFilter: FormGroup;
  public userSearchFilter: FormGroup;
  public adminUserSearchFilter: FormGroup;
  public requestedPaymentsSearchFilter: FormGroup;
  public prodSearchFilter: FormGroup;
  public provinceSearchFilter: FormGroup;
  public orderIssuesFilter: FormGroup;
  public childOrderFilter: FormGroup;
  public orderMessageSearchFilter: FormGroup;
  public deliveredOrderFilter: FormGroup;
  public SurveysSearchFilter: FormGroup;
  public filterOrderObj = {};
  public filterProductsObj?: VariantGroupListFilter;
  public filterChildOrderObj = {
    status: "",
    orderID: "",
    fromDate: "",
    toDate: "",
    zone: "",
    shippingCompanyStatus: "",
  };
  public shippingCompanyStatuses = [];
  public filterUserObj = {};
  public filterAdminUserObj = {};
  public filterProdObj = {};
  public filterOrderObjMsg = {};
  public filterRequestedPaymentsObj = {};
  public filterSurveyObj = {};
  public verifyOrder: boolean;
  public changeStatus: boolean;
  public clicked = false;
  public userRole = "";
  public reqObj = {};
  selectedStatus: string = "";
  selectCategories: Categories[];
  public orderIssues = [];
  public deliveredOrdersList = [];
  public currencyList = [];
  public userPrivileges: IUserPrivileges = {
    admin: false,
    viewOrders: false,
    viewAndEditMessages: false,
    confirmOrders: false,
    assignOrders: false,
    editOrders: false,
    verifyOrder: false,
    viewAndEditCategory: false,
    viewUsers: false,
    viewUserWallets: false,
    viewAndEditPayments: false,
    orderIssues: false,
    viewAndEditProvinces: false,
  };
  public confirmationAdmins = [];
  panelOpenState = false;
  provinceGroups = [];
  public selectedChildOrders = [];
  public isChildOrderSelected = false;
  public isChildOrderChecked: boolean;
  public isChangeChildOrderStatus: boolean;
  public ChildOrder: any = {};
  public isVerifyChildOrder: boolean;
  public surveys: any[] = [];
  public currencyFilterFeatureEnabled = false;
  public orderSourceOptions = ORDER_SOURCE_OPTIONS;

  public bulkTrackingFeatureEnabled = false;
  public isCmsPortalButtonVisible = false;
  public isOmPortalButtonVisible = false;
  public isUserFeatureButtonVisible = false;
  public isLoading = false;

  constructor(
    private provinceService: ProvinceService,
    private profileService: ProfileService,
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private toastr: ToastrService,
    private utilityService: UtilityService,
    private router: Router,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private shippingService: ShippingService,
    private spinner: NgxSpinnerService,
    private surveyService: SurveyService,
    private countryDropDown: CountryDropdownComponent,
    private sharedService: SharedService,
    private remoteConfigService: RemoteConfigService,
    private paymentWithdrawalsRepository: PaymentWithdrawalsRepository,
    private mixpanelService: MixpanelService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.orderSearchFilter = new FormGroup({
      status: new FormControl(),
      orderSource: new FormControl(),
      taggerId: new FormControl(),
      orderId: new FormControl(),
      province: new FormControl(),
      failedAttemptsCount: new FormControl(),
      assignedAdmin: new FormControl(),
      phoneNum: new FormControl(),
      duplicateOrMergeable: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      country: new FormControl(),
    });
    this.prodSearchFilter = new FormGroup({
      prodID: new FormControl(),
      category: new FormControl(),
      productAvailability: new FormControl(),
      country: new FormControl(),
    });
    this.provinceSearchFilter = new FormGroup({
      country: new FormControl(),
    });
    this.userSearchFilter = new FormGroup({
      phoneNum: new FormControl(),
      email: new FormControl(),
      taggerId: new FormControl(),
    });
    this.adminUserSearchFilter = new FormGroup({
      role: new FormControl(),
      phoneNum: new FormControl(),
      email: new FormControl(),
      taggerId: new FormControl(),
    });
    this.orderMessageSearchFilter = new FormGroup({
      orderId: new FormControl(),
      taggerId: new FormControl(),
      country: new FormControl(),
    });
    this.deliveredOrderFilter = new FormGroup({
      country: new FormControl(),
    });
    this.orderIssuesFilter = new FormGroup({
      taggerId: new FormControl(),
      orderId: new FormControl(),
      issueType: new FormControl(),
      issueStatus: new FormControl(),
      country: new FormControl(),
    });
    this.childOrderFilter = new FormGroup({
      orderID: new FormControl(),
      status: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      zone: new FormControl(),
      shippingCompanyStatus: new FormControl(),
      country: new FormControl(),
    });
    this.requestedPaymentsSearchFilter = new FormGroup({
      taagerId: new FormControl(),
      status: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      currency: new FormControl(),
    });
    this.SurveysSearchFilter = new FormGroup({
      surveyId: new FormControl(),
      name: new FormControl(),
      isEnabled: new FormControl(),
    });
    if (this.router.url === "/admin/order-message") {
      this.selectedIndex = 5;
      this.viewOrdersWithUnreadMessages();
    }
  }
  userCountry;
  environment = environment;
  ngOnInit() {
    this.isLoading = true;
    this.remoteConfigService.initializeFeatureFlags();
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.isLoading = false;
        const userInfo = response.data;
        localStorage.setItem("user_email", userInfo.email);
        localStorage.setItem("user_phonenumber", userInfo.phoneNum);
        this.userId = userInfo._id;
        this.firstName = userInfo.firstName;
        this.lastName = userInfo.lastName;
        this.email = userInfo.email;
        this.phoneNumber = userInfo.phoneNum;
        this.createdAt = userInfo.createdAt;
        this.userCollection = userInfo.userCollection;
        this.username = userInfo.username;
        this.profilePicture = userInfo.profilePicture;
        this.userLevel = userInfo.userLevel;
        localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, this.firstName);
        const taagerId = response.data.TagerID;
        this.isCmsPortalButtonVisible =
          !environment.production || CMS_ADMINS_ID_LIST.includes(taagerId);
        this.userService.getUserRoles().subscribe(
          (response: any) => {
            this.userRole = response.data.role;
            this.setUserPrivileges(response.data.privileges);
            this.userCountry = response.data.userCountriesAccess[0];
            this.sharedService.userCountryAccess =
              response.data.userCountriesAccess;
            this.viewOrdersStatusWithPrivileges(false, true);
          },
          (err) => {
            this.toastr.error(err.error.msg);
          },
          () => {
            this.getProvinces(this.userCountry);
          }
        );
      },
      (err) => {
        this.toastr.error(err.error.msg);
      }
    );

    this.productService.getCategories().subscribe((res) => {
      const categories = res.data;
      this.selectCategories = categories.filter((i) => i.name !== "all-items");
    });

    this.getConfirmationAdmins();
    this.remoteConfigService
      .getFeatureFlags("SHIPPING_TRACKING_IDS_FEATURE")
      .subscribe((flag) => {
        this.bulkTrackingFeatureEnabled = flag;
      });
    this.paymentWithdrawalsRepository.currencyFilterFeatureFlagObservable.subscribe(
      (flag) => {
        this.currencyFilterFeatureEnabled = flag;
      }
    );
    this.remoteConfigService
      .getFeatureFlags("ADMIN_OM_PORTAL_BUTTON_VISIBILE")
      .subscribe((flag) => {
        this.isOmPortalButtonVisible = flag;
      });
    this.remoteConfigService
      .getFeatureFlags("USER_FEATURE_BUTTON_VISIBILE")
      .subscribe((flag) => {
        this.isUserFeatureButtonVisible = flag;
      });
    this.mixpanelService.track("admin_dashboard_page_view");
  }
  getProvinces(country) {
    if (country) {
      this.orderService.getProvinces(country).subscribe((res: any) => {
        res.data.forEach((element) => {
          if (element.location) {
            this.provinces.push(element);
          }
        });
        const provinceGroups = this.createprovincesGroups(
          this.provinces,
          country
        );
        this.provinceGroups = provinceGroups;
      });
    }
  }
  public OnFromDateChange(event): void {
    this.filterOrderObj = { ...this.filterOrderObj, fromDate: event };
  }
  public OnToDateChange(event): void {
    this.filterOrderObj = { ...this.filterOrderObj, toDate: event };
  }

  public OnChildOrdersFromDateChange(event): void {
    this.filterChildOrderObj = { ...this.filterChildOrderObj, fromDate: event };
  }
  public OnChildOrdersToDateChange(event): void {
    this.filterChildOrderObj = { ...this.filterChildOrderObj, toDate: event };
  }

  public OnRequestedPaymentsFromDateChange(event): void {
    this.filterRequestedPaymentsObj = {
      ...this.filterRequestedPaymentsObj,
      fromDate: event,
    };
  }
  public OnRequestedPaymentsToDateChange(event): void {
    this.filterRequestedPaymentsObj = {
      ...this.filterRequestedPaymentsObj,
      toDate: event,
    };
  }

  getConfirmationAdmins() {
    this.userService.getAdminUsers().subscribe((res) => {
      const admins = [];
      res.data.forEach((element) => {
        if (element.userRole) {
          admins.push(element);
        }
      });
      this.confirmationAdmins = admins
        .filter(
          (x) =>
            x.userRole.role === "orderConfirmationsTeamMember" ||
            x.userRole.role === "orderConfirmationsTeamLeader" ||
            x.userRole.role === "ksaConfirmationsMember"
        )
        .map((x) => ({
          id: x._id,
          name: x.fullName,
          tagerId: x.TagerID,
        }));
    });
  }

  setUserPrivileges(privileges) {
    this.userPrivileges.admin = privileges.find((x) => x == "admin")
      ? true
      : false;
    this.userPrivileges.viewOrders = privileges.find((x) => x == "viewOrders")
      ? true
      : false;
    this.userPrivileges.viewAndEditMessages = privileges.find(
      (x) => x == "viewAndEditMessages"
    )
      ? true
      : false;
    this.userPrivileges.confirmOrders = privileges.find(
      (x) => x == "confirmOrders"
    )
      ? true
      : false;
    this.userPrivileges.assignOrders = privileges.find(
      (x) => x == "assignOrders"
    )
      ? true
      : false;
    this.userPrivileges.editOrders = privileges.find((x) => x == "editOrders")
      ? true
      : false;
    this.userPrivileges.verifyOrder = privileges.find((x) => x == "verifyOrder")
      ? true
      : false;
    this.userPrivileges.viewAndEditCategory = privileges.find(
      (x) => x == "viewAndEditCategory"
    )
      ? true
      : false;
    this.userPrivileges.viewUsers = privileges.find((x) => x == "viewUsers")
      ? true
      : false;
    this.userPrivileges.viewUserWallets = privileges.find(
      (x) => x == "viewUserWallets"
    )
      ? true
      : false;
    this.userPrivileges.viewAndEditPayments = privileges.find(
      (x) => x == "viewAndEditPayments"
    )
      ? true
      : false;
    this.userPrivileges.orderIssues = privileges.find((x) => x == "orderIssues")
      ? true
      : false;
    this.userPrivileges.viewAndEditProvinces = privileges.find(
      (x) => x == "viewAndEditProvinces"
    )
      ? true
      : false;
  }

  migrateUserRolesAndPrivileges(): void {
    this.userService.migrateUserRolesAndPrivileges().subscribe(
      (response: any) => {
        this.toastr.success(response.msg);
      },
      (err) => {
        this.toastr.error(err.error.msg);
      }
    );
  }

  viewUsers(): void {
    this.loading = true;
    this.userService
      .getUsers(this.maxItemPerPage, this.currentPage, this.filterUserObj)
      .subscribe(
        (res: any) => {
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.users = res.data;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
  }
  viewAdminUsers(): void {
    this.loading = true;
    this.userService
      .getAllAdminUsers(
        this.maxItemPerPage,
        this.currentPage,
        this.filterAdminUserObj
      )
      .subscribe(
        (res: any) => {
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.adminUsers = res.data;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
    this.getAdminUserRoles();
  }
  getAdminUserRoles(): void {
    this.loading = true;
    this.userService.getAdminUserRoles().subscribe(
      (res: any) => {
        this.roles = res.data;
        this.loading = false;
        this.ref.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.toastr.error(err.error.msg);
      }
    );
  }
  viewProvinces(country?): void {
    this.loading = true;
    this.sharedService.selectedCountryIso3 = country;
    this.provinces = [];
    if (country != undefined) {
      this.provinceService
        .getAllProvinces(this.maxItemPerPage, this.currentPage, country)
        .subscribe(
          (res: any) => {
            this.provinces = res.data;
            this.noOfItems = res.count;
            this.showPagination = res.count ? true : false;
            this.loading = false;
            this.ref.detectChanges();
          },
          (err) => {
            this.loading = false;
            this.toastr.error(err.error.msg);
          }
        );
    }
  }
  viewPaymentRequest(): void {
    this.loading = true;
    this.paymentWithdrawalsRepository
      .getPaymentWithdrawalRequest({
        maxItemPerPage: this.maxItemPerPage,
        currentPage: this.currentPage,
        filterRequestedPaymentsObj: this.filterRequestedPaymentsObj,
      })
      .subscribe(
        (res: any) => {
          this.paymentRequests = res.data;
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(
            err.error.msg || err.error.message || err.error.description
          );
        }
      );
  }

  viewOrders(country?): void {
    this.loading = true;
    this.orderService
      .getAllOrders(
        this.maxItemPerPage,
        this.currentPage,
        this.filterOrderObjMsg,
        country
      )
      .subscribe(
        (res: any) => {
          this.allOrders = res.data;
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
  }

  viewOrdersWithMessages(country?): void {
    this.loading = true;
    this.orderService
      .getAllOrdersWithMessages(
        this.maxItemPerPage,
        this.currentPage,
        this.filterOrderObjMsg,
        country
      )
      .subscribe(
        (res: any) => {
          this.allOrdersWithMessages = res.data;
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
  }

  viewOrdersWithUnreadMessages(country?): void {
    this.loading = true;
    this.orderService
      .getAllOrdersWithUnreadMessages(
        this.maxItemPerPage,
        this.currentPage,
        this.filterOrderObjMsg,
        country
      )
      .subscribe(
        (res: any) => {
          this.allOrdersWithUnreadMessages = res.data;
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
  }

  getOrdersExtract(): void {
    this.orderService.getAllOrdersExtract().subscribe(
      (res: any) => {
        this.allOrdersExtract = res.data;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.toastr.error(err.error.msg);
      }
    );
  }

  onDeleteUser(username: string): void {
    this.userService.deleteUser({ username }).subscribe(
      (res: any) => {
        this.toastr.success(res.msg);
        window.location.reload();
      },
      (err) => {}
    );
  }

  onDeactivateUser(userId: string): void {
    this.userService.setUserLevel({ id: userId, userLevel: "-1" }).subscribe(
      (res: any) => {
        this.toastr.success(res.msg);
        this.loadPaginationData();
      },
      (err) => {}
    );
  }

  onEditUserRole(user: string): void {
    const dialogRef = this.dialog.open(EditUserRoleComponent, {
      width: "400px",
      data: {
        UserObj: user,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadPaginationData();
    });
  }

  onViewProfile(id: string): void {
    this.userService.getUser(id).subscribe(
      (res: any) => {},
      () => {}
    );
  }

  onAcceptOrder(id: string, status: string): void {
    this.orderService
      .updateOrder({
        orderId: id,
        status,
      })
      .subscribe(
        (res: any) => {
          this.toastr.success(res.msg);
          // window.location.reload();
        },
        () => {}
      );
  }

  onAcceptRequest(id: string, status: string): void {
    this.orderService
      .updateRequest({
        requestId: id,
        status,
      })
      .subscribe(
        (res: any) => {
          this.toastr.success(res.msg);
          window.location.reload();
        },
        () => {}
      );
  }

  onRejectRequest(id: string): void {
    const dialogRef = this.dialog.open(RejectRequestDialogComponent, {
      width: "250px",
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onRejectOrder(id: string): void {
    const dialogRef = this.dialog.open(RejectOrderDialogComponent, {
      width: "250px",
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  viewPendingOrders(): void {
    this.loading = true;
    this.orderService
      .getPendingOrders(this.maxItemPerPage, this.currentPage)
      .subscribe(
        (response: any) => {
          this.pendingOrders = response.data;
          this.numberOfPendingOrders = response.count;
          this.noOfItems = response.count;
          this.showPagination = response.count ? true : false;
          if (this.numberOfOrders !== undefined) {
            this.succesfulOrdersNo =
              this.numberOfOrders - this.numberOfPendingOrders;
          } else {
            this.succesfulOrdersNo = 0;
          }
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
  }

  changeItemsOnPage(num: number) {
    this.maxItemPerPage = num;
    this.currentPage = 1;
    this.loadPaginationData();
  }

  pageChanged(event): void {
    this.currentPage = event.page;
    this.loadPaginationData();
  }

  viewInProgOrders(): void {
    this.loading = true;
    this.orderService
      .getInProgressOrders(this.maxItemPerPage, this.currentPage)
      .subscribe(
        (response: any) => {
          //  this.toastr.success(response.msg);
          this.inProgressOrders = response.data;
          this.noOfItems = response.count;
          this.showPagination = response.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.toastr.error(err.error.msg);
        }
      );
  }

  viewOrdersStatusWithPrivileges(isVerified, assignedOrders, country?): void {
    if (this.userPrivileges.confirmOrders || this.userPrivileges.assignOrders) {
      this.orderSearchFilter.get("status").setValue("order_received");
      this.filterOrderObj = {
        ...this.filterOrderObj,
        status: "order_received",
        country: this.orderMessageSearchFilter.value.country,
      };
      if (this.userPrivileges.assignOrders) {
        this.selectedIndex = 1;
      }
    }

    if (this.userPrivileges.orderIssues) {
      this.selectedIndex = 11;
    }

    this.loading = true;
    this.orderService
      .getOrderStatus(
        this.maxItemPerPage,
        this.currentPage,
        this.filterOrderObj,
        isVerified,
        assignedOrders,
        country
      )
      .subscribe(
        (response: any) => {
          this.noOfItems = response.count;
          this.showPagination = response.count ? true : false;
          this.isChecked = false;
          this.isSelected = false;
          if (assignedOrders) this.assignedOrdersList = response.data;
          else this.orderStatusList = response.data;
          this.assignedOrdersCount = response.assignedOrdersCount;
          const taggerCountArray = [];
          if (response.taggerCount) {
            response.taggerCount.forEach((element) => {
              if (element._id) {
                taggerCountArray[element._id.TagerID] = element.count;
              }
            });
          }
          this.taggerCounts = taggerCountArray;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.isChecked = false;
          this.isSelected = false;

          this.loading = false;
          this.toastr.error(err.error.msg);
        },
        () => {
          this.clicked = false;
        }
      );
  }

  viewOrdersStatus(isVerified, assignedOrders): void {
    this.loading = true;
    this.orderService
      .getOrderStatus(
        this.maxItemPerPage,
        this.currentPage,
        this.filterOrderObj,
        isVerified,
        assignedOrders,
        this.sharedService.selectedCountryIso3
      )
      .subscribe(
        (response: any) => {
          this.isChecked = false;
          this.isSelected = false;
          this.noOfItems = response.count;
          this.showPagination = response.count ? true : false;
          if (assignedOrders) this.assignedOrdersList = response.data;
          else this.orderStatusList = response.data;
          this.assignedOrdersCount = response.assignedOrdersCount;
          const taggerCountArray = [];
          if (response.taggerCount) {
            response.taggerCount.forEach((element) => {
              if (element._id) {
                taggerCountArray[element._id.TagerID] = element.count;
              }
            });
          }
          this.taggerCounts = taggerCountArray;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.isChecked = false;
          this.isSelected = false;

          this.loading = false;
          this.toastr.error(err.error.msg);
        },
        () => {
          this.clicked = false;
        }
      );
  }

  viewChildOrdersStatus(country?): void {
    this.loading = true;
    this.orderService
      .ViewChildOrders(
        this.maxItemPerPage,
        this.currentPage,
        country,
        this.filterChildOrderObj
      )
      .subscribe(
        (response: any) => {
          this.onChildOrdersTabChanged();
          this.allChildOrders = response.data;
          this.noOfItems = response.count;
          this.showPagination = response.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {
          this.onChildOrdersTabChanged();
          this.loading = false;
          this.toastr.error(err.error.msg);
        },
        () => {
          this.clicked = false;
        }
      );
  }

  getShippingCompanyStatuses(): void {
    this.orderService.getShippingCompanyStatuses().subscribe(
      (response: any) => {
        this.shippingCompanyStatuses = response.data;
      },
      (err) => {},
      () => {
        this.clicked = false;
      }
    );
  }

  onExtractOrders(): void {
    this.getOrdersExtract();
    this.utilityService.extractToExcel(this.allOrdersExtract, "Orders.csv");
  }

  onExtractPendingOrders(): void {
    if (!this.pendingOrders || !this.pendingOrders.length) {
      return;
    }
    this.utilityService.extractToExcel(this.pendingOrders, "pendingOrders.csv");
  }

  onExtractUsers(): void {
    if (!this.users || !this.users.length) {
      return;
    }
    this.utilityService.extractToExcel(this.users, "users.csv");
  }

  openExtractUsersDialog(): void {
    const dialogRef = this.dialog.open(ExtractUsersDialogComponent, {
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  openAssignOrdersDialog(order): void {
    const filterOrder = this.selectedOrders.filter((x) => x._id === order._id);
    if (filterOrder.length === 0) {
      this.selectedOrders.push({
        _id: order._id,
        orderID: order.orderID,
        status: order.status,
        orderProfit: order.orderProfit,
        orderedBy: order.orderedBy,
        isOrderVerified: order.isOrderVerified,
      });
    }
    const dialogRef = this.dialog.open(AssignOrdersComponent, {
      width: "400px",
      data: {
        orders: this.selectedOrders,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedOrders = [];
      this.verifyOrder = false;
      this.changeStatus = false;
      this.loadPaginationData();
    });
  }

  onRecalculateProfit(): void {
    const dialogRef = this.dialog.open(CalculateProfitDialogComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onBulkUpload(): void {
    const dialogRef = this.dialog.open(ShippingBulkOrdersComponent, {
      width: "800px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onBulkUploadTracking(): void {
    const dialogRef = this.dialog.open(BulkUploadTrackingIdComponent, {
      width: "800px",
    });
  }

  onChildBulkUpload(): void {
    const dialogRef = this.dialog.open(ShippingBulkChildOrdersComponent, {
      width: "800px",
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openUserFeatureDialog(): void {
    const dialogRef = this.dialog.open(UserFeaturesDialogComponent, {
      width: "650px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openNotificationDialog(): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: "650px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openExportOrderDialog(): void {
    const dialogRef = this.dialog.open(ExportOrdersStatusComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  openAnnounceDialog(): void {
    const dialogRef = this.dialog.open(AddAnnouncementComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  duplicateOrderDialog(order): void {
    const dialogRef = this.dialog.open(OrderDataDialogComponent, {
      width: "800px",
      height: "90%",
      position: { top: `5%` },
      data: {
        OrderObj: order,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  mergeableOrderDialog(order): void {
    const dialogRef = this.dialog.open(MergeableOrderDialogComponent, {
      width: "800px",
      height: "90%",
      position: { top: `5%` },
      data: {
        OrderObj: order,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPaginationData();
    });
  }

  openAddProvinceDialog(): void {
    const dialogRef = this.dialog.open(AddProvinceComponent, {
      width: "800px",
      data: {
        id: "",
        location: "",
        branch: "",
        shippingRevenue: "",
        shippingCost: "",
        minETA: "",
        maxETA: "",
        isActive: "",
        edit: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const selectedCountry = this.sharedService.selectedCountryIso3;
      this.viewProvinces(selectedCountry);
    });
  }
  openAddPaymentDialog(): void {
    const dialogRef = this.dialog.open(PaymentRequestComponent, {
      width: "400px",
      data: {
        id: "",
        UserId: "",
        Username: "",
        TagerID: "",
        amount: Number,
        paymentWay: "",
        phoneNum: "",
        status: "",
        screenStatus: "newRequest",
        maxAmount: 0,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.viewPaymentRequest();
    });
  }

  openPaymentDialog(id): void {
    const request = this.paymentRequests.find((p) => p._id === id);

    const dialogRef = this.dialog.open(PaymentRequestComponent, {
      width: "400px",
      data: {
        id: request._id,
        UserId: request.userId,
        Username: request.userId.firstName,
        TagerID: request.userId.TagerID,
        amount: request.amount,
        paymentWay: request.paymentWay,
        phoneNum: request.phoneNum,
        status: request.status,
        screenStatus: "changeStatus",
        maxAmount: 0,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.viewPaymentRequest();
    });
  }

  openProvinceDialog(id): void {
    const province = this.provinces.find((p) => p._id === id);
    const dialogRef = this.dialog.open(AddProvinceComponent, {
      width: "800px",
      data: {
        id: province._id,
        location: province.location,
        branch: province.branch,
        shippingRevenue: province.shippingRevenue,
        shippingCost: province.shippingCost,
        minETA: province.minETA,
        maxETA: province.maxETA,
        isActive: province.isActive,
        edit: true,
        redZones: province.redZones,
        greenZones: province.greenZones,
        country: province.country,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const selectedCountry = this.sharedService.selectedCountryIso3;
      this.viewProvinces(selectedCountry);
    });
  }

  onTabChanged(event) {
    const activeTabIndex = event.index;
    this.selectedIndex = activeTabIndex;
    this.showPagination = false;
    this.noOfItems = 0;
    this.currentPage = 1;
    if (this.selectedIndex === 1) {
      if (this.userRole === "returnAndRefunds") {
        this.orderSearchFilter.get("status").setValue("refund_in_progress");
        this.filterOrderObj = {
          ...this.filterOrderObj,
          status: "refund_in_progress",
        };
      }
      // this.viewOrdersStatus(false, false);
    } else if (this.selectedIndex === 2) {
      this.clearAndReset();
      this.filterOrderObj = {};
      // this.viewOrdersStatus(true, false);
    } else if (this.selectedIndex === 4) {
      this.viewUsers();
    } else if (this.selectedIndex === 11) {
      this.viewAdminUsers();
    } else if (this.selectedIndex === 5) {
      this.clearAndReset();
    } else if (this.selectedIndex === 6) {
      this.clearAndReset();
    } else if (this.selectedIndex === 7) {
      this.clearAndReset();
    } else if (this.selectedIndex === 8) {
      this.currencyList = this.paymentWithdrawalsRepository.currencyList;
      this.viewPaymentRequest();
    } else if (this.selectedIndex === 9) {
      this.clearProvinceFilter("clearOnly");
      // this.viewProvinces();
    } else if (this.selectedIndex === 10) {
      this.clearIssuesFilter();
    } else if (this.selectedIndex === 12) {
      this.filterChildOrderObj = {
        status: "",
        orderID: "",
        fromDate: "",
        toDate: "",
        zone: "",
        shippingCompanyStatus: "",
      };
      this.getShippingCompanyStatuses();
    } else if (this.selectedIndex === 13) {
      this.viewSurveys();
    }
    this.countryDropDown.resetSelection();
  }

  loadPaginationData() {
    let selectedCountry = this.sharedService.selectedCountryIso3;
    if (this.selectedIndex === 0) {
      this.viewOrdersStatus(false, true);
    } else if (this.selectedIndex === 1) {
      this.viewOrdersStatus(false, false);
    } else if (this.selectedIndex === 2) {
      this.clearAndReset();
      this.filterOrderObj = {};
      this.viewOrdersStatus(true, false);
    } else if (this.selectedIndex === 3) {
      this.getDeliveredOrders(selectedCountry);
    } else if (this.selectedIndex === 11) {
      this.viewAdminUsers();
    } else if (this.selectedIndex === 4) {
      this.viewUsers();
    } else if (this.selectedIndex === 5) {
      this.viewOrders(selectedCountry);
    } else if (this.selectedIndex === 6) {
      this.viewOrdersWithMessages(selectedCountry);
    } else if (this.selectedIndex === 7) {
      this.viewOrdersWithUnreadMessages(selectedCountry);
    } else if (this.selectedIndex === 8) {
      this.viewPaymentRequest();
    } else if (this.selectedIndex === 9) {
      this.viewProvinces(selectedCountry);
    } else if (this.selectedIndex === 10) {
      this.viewOrderIssues(selectedCountry);
    } else if (this.selectedIndex === 12) {
      this.viewChildOrdersStatus(selectedCountry);
    } else if (this.selectedIndex === 13) {
      this.viewSurveys();
    }
  }

  changeOrderProductPrice(order): void {
    const dialogRef = this.dialog.open(ChangeOrderProductsPriceComponent, {
      width: "1100px",
      data: {
        _id: order._id,
        products: order.products,
        productQuantities: order.productQuantities,
        productPrices: order.productPrices,
        productIds: order.productIds,
        orderId: order.orderID,
        cashOnDelivery: order.cashOnDelivery,
        profit: order.orderProfit,
        productProfits: order.productProfits,
        province: order.province,
        orderStatus: order.status,
        order: order,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadPaginationData();
    });
  }

  revertOrderStatus(order): void {
    const dialogRef = this.dialog.open(RevertStatusComponent, {
      width: "400px",
      data: {
        OrderObj: order,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadPaginationData();
    });
  }
  async onTrackOrder(order) {
    if (!order._id) {
      await this.orderService
        .getOrderById(order.orderObjectId)
        .subscribe((res) => {
          order = res.data;
          const dialogRef = this.dialog.open(OrderItemDialogComponent, {
            width: "1200px",
            data: {
              order: order,
              viewProducts: false,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {});
        });
    } else {
      const dialogRef = this.dialog.open(OrderItemDialogComponent, {
        width: "1200px",
        data: {
          order: order,
          viewProducts: false,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
  changeOrderStatus(order): void {
    const filterOrder = this.selectedOrders.filter((x) => x._id === order._id);
    const batchUpdate = this.selectedOrders.length > 1;
    if (filterOrder.length === 0) {
      this.selectedOrders.push({
        _id: order._id,
        orderID: order.orderID,
        status: order.status,
        orderProfit: order.orderProfit,
        orderedBy: order.orderedBy,
        isOrderVerified: order.isOrderVerified,
      });
    }

    const dialogRef = this.dialog.open(ChangeOrderStatusDialogComponent, {
      width: "550px",
      data: {
        selectedOrders: this.selectedOrders,
        orderStatus: order.status,
        batchUpdate,
        notes: order.notes,
        streetName: order.streetName,
        detailedAddress: order.detailedAddress || {},
        products: order.products,
        productQuantities: order.productQuantities,
        productPrices: order.productPrices,
        productIds: order.productIds,
        orderID: order.orderID,
        createdAt: order.createdAt,
        country: order.country,
        receiverName: order.receiverName,
        phoneNumber: order.phoneNumber,
        phoneNumber2: order.phoneNumber2,
        province: order.province,
        cashOnDelivery: order.cashOnDelivery,
        profit: order.orderProfit,
        productReturnQuantities: order.productReturnQuantities,
        productReplacedQuantities: order.productReplacedQuantities,
        productProfits: order.productProfits,
        shippingInfo: order.shippingInfo,
        failedAttemptsCount: order.failedAttemptsCount,
        failedAttemptNote: order.failedAttemptNote,
        shippingNotes: order.shippingNotes,
        _id: order._id,
        userprivileges: this.userPrivileges,
        userRole: this.userRole,
        orderSource: order.orderSource ? order.orderSource : null,
        zone: order.zone ? order.zone : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedOrders = [];
      this.verifyOrder = false;
      this.changeStatus = false;
      this.loadPaginationData();
    });
  }

  changeChildOrderStatus(order): void {
    const filterChildOrder = this.selectedChildOrders.filter(
      (x) => x._id === order._id
    );

    const batchUpdate = this.selectedChildOrders.length > 1;

    if (filterChildOrder.length === 0) {
      this.selectedChildOrders.push({
        _id: order._id,
        orderID: order.orderID,
        status: order.status,
        parentOrderObjectId: order.parentOrderObjectId,
      });
    }

    const dialogRef = this.dialog.open(ChangeChildOrderStatusDialogComponent, {
      width: "550px",
      data: {
        selectedOrders: this.selectedChildOrders,
        batchUpdate,
        id: order._id,
        cashOnDelivery: order.cashOnDelivery,
        cashRefunded: order.cashRefunded,
        orderID: order.orderID,
        orderIssueID: order.orderIssueID,
        orderProfit: order.orderProfit,
        parentOrderId: order.parentOrderId,
        parentOrderObjectId: order.parentOrderObjectId,
        phoneNumber: order.phoneNumber,
        phoneNumber2: order.phoneNumber2,
        product: order.product,
        province: order.province,
        receiverName: order.receiverName,
        status: order.status,
        streetName: order.streetName,
        zone: order.zone,
        userprivileges: this.userPrivileges,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPaginationData();
      this.onChildOrdersTabChanged();
    });
  }

  selectOrder(order) {
    const filterOrder = this.selectedOrders.filter((x) => x._id === order._id);
    if (filterOrder.length === 0) {
      var addOrder = true;
      if (this.selectedOrders.length > 0) {
        if (
          this.selectedOrders[this.selectedOrders.length - 1].status !=
          order.status
        ) {
          addOrder = false;
          this.verifyOrder = true;
        }
      }
      this.selectedOrders.push({
        _id: order._id,
        orderID: order.orderID,
        status: order.status,
        orderProfit: order.orderProfit,
        orderedBy: order.orderedBy,
        isOrderVerified: order.isOrderVerified,
        products: order.products,
      });
      order.selected = true;
      this.changeStatus = true;
    }
  }

  selectAllOrders() {
    this.isSelected = !this.isSelected;

    if (!this.isSelected) {
      this.orderStatusList.forEach((order) => {
        delete order.checked;
      });
      return;
    }

    this.orderStatusList.forEach((order) => {
      order.checked = true;

      if (order.checked) {
        this.selectOrder(order);
      } else {
        const filterOrderIndex = this.selectedOrders.findIndex(
          (x) => x._id === order._id
        );
        if (filterOrderIndex > -1) {
          this.selectedOrders.splice(filterOrderIndex, 1);
          order.selected = false;
          if (this.selectedOrders.length == 0) {
            this.verifyOrder = false;
            this.changeStatus = false;
          }
        }
      }

      this.selectOrder(order);
    });
  }

  selectChildOrder(childOrder) {
    const filterChildOrder = this.selectedChildOrders.filter(
      (x) => x._id === childOrder._id
    );

    if (filterChildOrder.length === 0) {
      if (this.selectedChildOrders.length > 0) {
        if (
          this.selectedChildOrders[this.selectedChildOrders.length - 1]
            .status != childOrder.status
        ) {
          this.isVerifyChildOrder = true;
        }
      }

      this.selectedChildOrders.push({
        _id: childOrder._id,
        orderID: childOrder.orderID,
        status: childOrder.status,
        orderProfit: childOrder.orderProfit,
        isOrderVerified: childOrder.isOrderVerified,
        product: childOrder.product,
        parentOrderObjectId: childOrder.parentOrderObjectId,
      });
      childOrder.selected = true;
      this.isChangeChildOrderStatus = true;
    }
  }

  selectAllChildOrders() {
    this.isChildOrderSelected = !this.isChildOrderSelected;

    if (!this.isChildOrderSelected) {
      this.allChildOrders.forEach((childOrder) => {
        delete childOrder.checked;
      });
      this.selectedChildOrders = [];
      this.isChangeChildOrderStatus = false;
      return;
    }

    this.allChildOrders.forEach((childOrder) => {
      childOrder.checked = true;

      if (childOrder.checked) {
        this.selectChildOrder(childOrder);
      } else {
        const filterChildOrderIndex = this.selectedChildOrders.findIndex(
          (x) => x._id === childOrder._id
        );

        if (filterChildOrderIndex > -1) {
          this.selectedChildOrders.splice(filterChildOrderIndex, 1);

          childOrder.selected = false;

          if (this.selectedChildOrders.length == 0) {
            this.isVerifyChildOrder = false;
            this.isChangeChildOrderStatus = false;
          }
        }
      }

      this.selectChildOrder(childOrder);
    });
  }

  selectedChildOrdersValue(event, order) {
    if (event.checked) {
      this.selectChildOrder(order);
    } else {
      const filterOrderIndex = this.selectedChildOrders.findIndex(
        (x) => x._id === order._id
      );

      if (filterOrderIndex > -1) {
        this.selectedChildOrders.splice(filterOrderIndex, 1);

        order.selected = false;

        if (this.selectedChildOrders.length == 0) {
          this.isChangeChildOrderStatus = false;
        }
      }
    }
  }

  onChildOrdersTabChanged() {
    this.isChildOrderChecked = false;
    this.isChildOrderSelected = false;
    this.isChangeChildOrderStatus = false;
    this.selectedChildOrders = [];
    this.isVerifyChildOrder = false;
  }

  showSelectButtonsOnStatus(status) {
    return (
      status === "refund_request_accepted" ||
      status === "replacement_request_accepted" ||
      status === "order_addition_request_approved"
    );
  }

  selectedOrdersValue(event, order) {
    if (event.checked) {
      this.selectOrder(order);
    } else {
      const filterOrderIndex = this.selectedOrders.findIndex(
        (x) => x._id === order._id
      );
      if (filterOrderIndex > -1) {
        this.selectedOrders.splice(filterOrderIndex, 1);
        order.selected = false;
        if (this.selectedOrders.length == 0) {
          this.verifyOrder = false;
          this.changeStatus = false;
        }
      }
    }
  }

  searchOrder(searchForm) {
    this.filterOrderObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.taggerId !== null ||
      searchForm.value.status !== null ||
      searchForm.value.orderId !== null ||
      searchForm.value.province !== null ||
      searchForm.value.assignedAdmin !== null ||
      searchForm.value.failedAttemptsCount !== null ||
      searchForm.value.phoneNum !== null ||
      searchForm.value.duplicateOrMergeable !== null ||
      searchForm.value.fromDate !== null ||
      searchForm.value.toDate !== null ||
      searchForm.value.orderSource !== null ||
      searchForm.value.country !== null
    ) {
      if (this.selectedIndex === 0) this.viewOrdersStatus(false, true);
      else this.viewOrdersStatus(false, false);
    } else {
      this.toastr.error(
        "Please select order status or enter order Id or enter tagger Id"
      );
    }
  }

  searchOrderIssues(searchForm) {
    this.filterOrderObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.taggerId !== null ||
      searchForm.value.orderId !== null ||
      searchForm.value.phoneNum !== null ||
      searchForm.value.fromDate !== null ||
      searchForm.value.toDate !== null ||
      searchForm.value.issueType !== null ||
      searchForm.value.issueStatus !== null ||
      searchForm.value.country !== null
    ) {
      this.viewOrderIssues(this.sharedService.selectedCountryIso3);
    } else {
      this.toastr.error(
        "Please select order status or enter order Id or enter tagger Id"
      );
    }
  }

  searchChildOrder(searchForm) {
    this.filterChildOrderObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.orderID !== null ||
      searchForm.value.status !== null ||
      searchForm.value.fromDate !== null ||
      searchForm.value.toDate !== null ||
      searchForm.value.zone !== null ||
      searchForm.value.shippingCompanyStatus !== null ||
      searchForm.value.country !== null
    ) {
      this.viewChildOrdersStatus(this.sharedService.selectedCountryIso3);
    } else {
      this.toastr.error(
        "Please select order status or enter order ID or enter fromDate or enter toDate or enter zone or enter shippingCompanyStatus"
      );
    }
  }

  searchUser(searchForm) {
    this.filterUserObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.taggerId !== null ||
      searchForm.value.email !== null ||
      searchForm.value.phoneNum !== null
    ) {
      this.viewUsers();
    } else {
      this.toastr.error(
        "Please enter email or enter phone number or enter tagger Id"
      );
    }
  }

  searchAdminUser(searchForm) {
    this.filterAdminUserObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.taggerId !== null ||
      searchForm.value.email !== null ||
      searchForm.value.phoneNum !== null ||
      searchForm.value.role
    ) {
      this.viewAdminUsers();
    } else {
      this.toastr.error(
        "Please enter email or enter phone number or enter tagger Id"
      );
    }
  }

  searchRequestedPayments(searchForm) {
    this.filterRequestedPaymentsObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.taagerId !== null ||
      searchForm.value.status !== null ||
      searchForm.value.fromDate !== null ||
      searchForm.value.toDate !== null ||
      searchForm.value.currency !== null
    ) {
      this.viewPaymentRequest();
    } else {
      this.toastr.error("Please enter currency or taager Id or status or date");
    }
  }

  searchSurveys(searchForm) {
    this.filterSurveyObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.surveyId !== null ||
      searchForm.value.name !== null ||
      searchForm.value.isEnabled !== null
    ) {
      this.viewSurveys();
    } else {
      this.toastr.error("Please enter survey name or survey number or status");
    }
  }

  clearFilter(): void {
    this.countryDropDown.resetSelection();
    this.orderSearchFilter.reset();
    this.filterOrderObj = {};
    this.setProvincesByCountry(this.sharedService.selectedCountryIso3);
    if (this.selectedIndex === 0) this.viewOrdersStatus(false, true);
    else this.viewOrdersStatus(false, false);
  }

  clearIssuesFilter(): void {
    this.orderIssuesFilter.reset();
    this.filterOrderObj = { issueStatus: "received" };
    this.orderIssuesFilter.get("issueStatus").setValue("received");
    this.viewOrderIssues();
  }

  clearIssuesFilterButton(): void {
    this.countryDropDown.resetSelection();
    this.orderIssuesFilter.reset();
    this.filterOrderObj = {};
    this.viewOrderIssues(this.sharedService.selectedCountryIso3);
  }

  clearChildOrderFilter(): void {
    this.countryDropDown.resetSelection();
    this.childOrderFilter.reset();
    this.filterChildOrderObj = {
      status: "",
      orderID: "",
      fromDate: "",
      toDate: "",
      zone: "",
      shippingCompanyStatus: "",
    };
    this.viewChildOrdersStatus(this.sharedService.selectedCountryIso3);
  }

  clearUserFilter(): void {
    this.userSearchFilter.reset();
    this.filterUserObj = {};
    this.viewUsers();
  }

  clearSurveyFilter(): void {
    this.SurveysSearchFilter.reset();
    this.filterSurveyObj = {};
    this.viewSurveys();
  }

  clearAdminUserFilter(): void {
    this.adminUserSearchFilter.reset();
    this.filterAdminUserObj = {};
    this.viewAdminUsers();
  }

  clearProvinceFilter(clear?): void {
    this.countryDropDown.resetSelection();
    this.provinceSearchFilter.reset();
    if (clear == undefined) {
      this.viewProvinces(this.sharedService.selectedCountryIso3);
    }
    this.currentPage = 1;
  }

  clearRequestedPaymentsFilter(): void {
    this.requestedPaymentsSearchFilter.reset();
    this.filterRequestedPaymentsObj = {};
    this.viewPaymentRequest();
  }

  clearAndReset(): void {
    this.filterOrderObjMsg = {};
    this.orderMessageSearchFilter.reset();
  }

  clearFilterMsg(): void {
    this.countryDropDown.resetSelection();
    this.orderMessageSearchFilter.reset();
    this.filterOrderObjMsg = {};
    this.orderMessageSearchFilter.controls.country.setValue(this.userCountry);
    if (this.selectedIndex === 1) {
      this.filterOrderObj = {};
      this.viewOrdersStatus(true, false);
    } else if (this.selectedIndex === 2) {
      this.filterOrderObj = {};
      this.viewOrdersStatus(true, false);
    } else if (this.selectedIndex === 5) {
      this.viewOrders(this.userCountry);
    } else if (this.selectedIndex === 6) {
      this.viewOrdersWithMessages(this.userCountry);
    } else if (this.selectedIndex === 7) {
      this.viewOrdersWithUnreadMessages();
    }
  }
  clearDeliveredOrders(): void {
    this.countryDropDown.resetSelection();
    this.deliveredOrderFilter.reset();
    this.getDeliveredOrders(this.sharedService.selectedCountryIso3);
  }
  searchOrderMessage(searchForm) {
    this.filterOrderObjMsg = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.taggerId !== null ||
      searchForm.value.orderId !== null ||
      searchForm.value.country !== null
    ) {
      if (searchForm.value.country != undefined) {
        if (this.selectedIndex === 2) {
          this.filterOrderObj = searchForm.value;
          this.viewOrdersStatus(true, false);
        } else if (this.selectedIndex === 5) {
          this.viewOrders(searchForm.value.country);
        } else if (this.selectedIndex === 6) {
          this.viewOrdersWithMessages(searchForm.value.country);
          this.filterOrderObj = searchForm.value;
        } else if (this.selectedIndex === 7) {
          this.viewOrdersWithUnreadMessages(searchForm.value.country);
        }
      } else {
        this.toastr.error("Please enter order Id or enter tagger Id");
      }
    }
  }
  searchDeliveredOrder(searchForm) {
    this.filterOrderObj = searchForm.value;
    this.currentPage = 1;
    if (
      searchForm.value.country !== null &&
      searchForm.value.country !== undefined
    ) {
      this.getDeliveredOrders(searchForm.value.country);
    }
  }
  unVerifyOrder(order) {
    this.clicked = true;
    this.orderService.unVerifyOrderStatus(order).subscribe(
      (res: any) => {
        this.loadPaginationData();
        this.toastr.success(res.msg);
      },
      (err) => {}
    );
  }
  verifiedOrder(order) {
    this.clicked = true;
    const filterOrder = this.selectedOrders.filter((x) => x._id === order._id);
    if (filterOrder.length === 0) {
      this.selectedOrders.push({
        _id: order._id,
        orderID: order.orderID,
        status: order.status,
        orderProfit: order.orderProfit,
        orderedBy: order.orderedBy,
        isOrderVerified: order.isOrderVerified,
      });
    }
    const filteredOrders = this.selectedOrders.filter(
      (x) =>
        x.status == "cancel" ||
        x.status == "customer_refused" ||
        x.status == "taager_cancelled" ||
        x.status == "delivered" ||
        x.status == "return_verified" ||
        x.status == "replacement_verified" ||
        x.status == "refund_verified"
    );
    this.orderService
      .updateOrderVerifiedStatus({ orders: filteredOrders })
      .subscribe(
        (res: any) => {
          this.selectedOrders = [];
          this.verifyOrder = false;
          this.changeStatus = false;
          this.loadPaginationData();
          this.toastr.success(res.msg);
        },
        (err) => {
          this.clicked = false;
        },
        () => {}
      );
  }

  verifyChildOrder(order) {
    this.clicked = true;

    this.orderService
      .verifyChildOrder({ childOrderID: order.orderID })
      .subscribe(
        (res: any) => {
          this.changeStatus = false;
          this.loadPaginationData();
          this.toastr.success(res.msg);
        },
        (err) => {
          this.clicked = false;
          this.toastr.error(err.error.msg);
        },
        () => {}
      );
  }

  receiveItemChildOrder(order) {
    this.clicked = true;

    this.orderService
      .itemReceiveChildOrder({ childOrderID: order.orderID })
      .subscribe(
        (res: any) => {
          this.changeStatus = false;
          this.loadPaginationData();
          this.toastr.success(res.msg);
        },
        (err) => {
          this.clicked = false;
          this.toastr.error(err.error.msg);
        },
        () => {}
      );
  }

  openChatModel(orderObj): void {
    const dialogRefOrderChat = this.dialog.open(OrderChatComponent, {
      width: "850px",
      data: {
        order: orderObj,
        adminId: this.userId,
      },
      disableClose: true,
    });
    dialogRefOrderChat.afterClosed().subscribe((result) => {
      //this.loadPaginationData();
    });
  }
  openAdminChatModel(orderObj): void {
    const dialogRefOrderAdminChat = this.dialog.open(OrderAdminChatComponent, {
      width: "850px",
      data: {
        order: orderObj,
        adminId: this.userId,
      },
      disableClose: true,
    });
    dialogRefOrderAdminChat.afterClosed().subscribe((result) => {
      //this.loadPaginationData();
    });
  }

  calculateProductsOrderCounts(): void {
    this.productService.setProductsOrderCount().subscribe(
      (res) => {
        this.toastr.success(res.msg);
      },
      (err) => {}
    );
  }

  onMigrateLoyaltyPrograms(): void {
    this.orderService.migrateLoyaltyPrograms().subscribe(
      (res) => {
        this.toastr.success(res.msg);
      },
      (err) => {}
    );
  }

  viewOrderIssues(country?) {
    if (country) {
      this.orderService
        .ViewOrderIssues(
          this.maxItemPerPage,
          this.currentPage,
          this.filterOrderObj,
          country
        )
        .subscribe((res) => {
          this.orderIssues = res.data;
          this.noOfItems = res.count;
          this.showPagination = res.count ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        });
    }
  }

  getIssueType(type) {
    switch (type) {
      case 1:
        return "Ø§Ø³ØªØ±Ø¬Ø§Ø¹";
        break;
      case 2:
        return "Ø§Ø³ØªØ¨Ø¯Ø§Ù„";
        break;
      case 3:
        return "Ø§Ø³ØªÙƒÙ…Ø§Ù„";
        break;
    }
  }

  openOrderIssueDialog(order): void {
    const dialogRef = this.dialog.open(OrderIssueDialogComponent, {
      width: "500px",
      data: {
        orderIssue: order,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadPaginationData();
    });
  }
  viewOrderIssue(order) {
    this.orderService.getOrderIssue({ orderId: order._id }).subscribe((res) => {
      this.openOrderIssueDialog(res.data[0]);
    });
  }
  getDeliveredOrders(country?) {
    this.loading = true;
    this.orderService
      .getDeliveredBostaOrders(
        this.maxItemPerPage,
        this.currentPage,
        this.filterOrderObj,
        country
      )
      .subscribe((res) => {
        this.deliveredOrdersList = res.data;
        this.noOfItems = res.count;
        this.showPagination = res.count ? true : false;
        this.loading = false;
        this.ref.detectChanges();
        this.loading = false;
      });
  }
  changeBostaOrderStatus(order, status) {
    const reqObj = {
      orders: [
        {
          _id: order._id,
          orderID: order.orderID,
          status: order.status,
          orderProfit: order.orderProfit,
          orderedBy: order.orderedBy,
          isOrderVerified: order.isOrderVerified,
        },
      ],
      status: status,
    };
    this.orderService.updateOrderStatusCustom(reqObj).subscribe(
      (res: any) => {
        this.orderService
          .updateOrderShipmentStatus({
            orderObjectId: order._id,
            shipmentStatus: "verified",
          })
          .subscribe((res) => {
            this.toastr.success(res.msg);
            this.getDeliveredOrders();
          });
        this.toastr.success(res.msg);
      },
      (err) => {
        this.clicked = false;
        this.toastr.error(err.error.msg);
      }
    );
  }
  addProvinceZones(event) {
    const {
      target: { name, files },
    } = event;

    let file = files[0];
    let fr = new FileReader();
    fr.readAsText(file);

    let globalThis = this;
    fr.onload = (e) => {
      let content = e.target.result.toString();

      const lines = content.split("\n");
      const result = [];
      const headers = lines[0].split(",");

      let orders = [];
      let errors = [];
      let provinces = [];
      let flag = false;
      //file format validation
      for (let indx = 1; indx < lines.length; indx++) {
        const element = lines[indx];
        const values = element.split(",");
        provinces.map((x) => {
          if (x.province == values[0]) {
            flag = true;
            if (values[2].toLowerCase().trim() == "red")
              x.redZones.push(values[1]);
            else x.greenZones.push(values[1]);
          }
        });
        if (!flag) {
          provinces.push({
            province: values[0],
            redZones:
              values[2].toLowerCase().trim() == "red" ? [values[1]] : [],
            greenZones:
              values[2].toLowerCase().trim() == "red" ? [] : [values[1]],
          });
        }
        flag = false;
      }
      this.provinceService
        .addProvinceZones({ provinces: provinces })
        .subscribe((res) => {
          this.toastr.success("Provinces updated successfully");
        });
    };
  }

  createprovincesGroups(provinces, country) {
    if (country == "EGY") {
      const provinceGroups = [
        {
          name: "Great Cai, Alex",
          province: [],
        },
        {
          name: "Delta Cities",
          province: [],
        },
        {
          name: "Upper Egypt",
          province: [],
        },
        {
          name: "The Rest of Provinces",
          province: [],
        },
      ];

      provinces.forEach((province) => {
        if (province.location) {
          switch (province.location) {
            case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©":
            case "Ø§Ù„Ù‚Ù„ÙŠÙˆØ¨ÙŠØ©":
            case "Ø§Ù„Ø¬ÙŠØ²Ø©":
            case "Ø§Ù„Ø£Ø³ÙƒÙ†Ø¯Ø±ÙŠØ©":
              provinceGroups[0].province.push({
                value: province.location,
                viewValue: province.location,
              });
              break;

            case "Ø§Ù„Ø¯Ù‚Ù‡Ù„ÙŠØ©":
            case "Ø§Ù„Ø¨Ø­ÙŠØ±Ø©":
            case "Ø§Ù„Ø´Ø±Ù‚ÙŠØ©":
            case "ÙƒÙØ± Ø§Ù„Ø´ÙŠØ®":
            case "Ø¯Ù…ÙŠØ§Ø·":
            case "Ø§Ù„Ù…Ù†ÙˆÙÙŠØ©":
            case "Ø¨ÙˆØ± Ø³Ø¹ÙŠØ¯":
            case "Ø³ÙˆÙŠØ³":
            case "Ø§Ù„Ø§Ø³Ù…Ø§Ø¹ÙŠÙ„ÙŠØ©":
              provinceGroups[1].province.push({
                value: province.location,
                viewValue: province.location,
              });
              break;

            case "Ù…Ù†ÙŠØ§":
            case "Ø³ÙˆÙ‡Ø§Ø¬":
            case "Ù‚Ù†Ø§":
            case "Ø£Ø³ÙˆØ§Ù†":
            case "Ø§Ø³ÙŠÙˆØ·":
            case "Ø§Ù„ÙÙŠÙˆÙ…":
            case "Ø¨Ù†ÙŠ Ø³ÙˆÙŠÙ":
            case "Ø§Ù„Ø£Ù‚ØµØ±":
            case "Ù…Ø·Ø±ÙˆØ­":
            case "Ø§Ù„ÙˆØ§Ø¯ÙŠ Ø§Ù„Ø¬Ø¯ÙŠØ¯":
            case "Ø¬Ù†ÙˆØ¨ Ø³ÙŠÙ†Ø§Ø¡":
            case "Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø£Ø­Ù…Ø±":
            case "Ø§Ù„ØºØ±Ø¯Ù‚Ø©":
            case "Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø£Ø­Ù…Ø± / Ø§Ù„ØºØ±Ø¯Ù‚Ø©":
              provinceGroups[2].province.push({
                value: province.location,
                viewValue: province.location,
              });
              break;

            default:
              provinceGroups[3].province.push({
                value: province.location,
                viewValue: province.location,
              });
              break;
          }
        }
      });
      return provinceGroups;
    } else {
      return provinces;
    }
  }

  async updateChildOrderStatus(orderID, shippingInfo) {
    let orderIdsArray = [];
    orderIdsArray.push(orderID);
    this.orderService
      .viewChildOrdersWithIDs(orderIdsArray)
      .subscribe(async (res) => {
        this.ChildOrder.orders = [
          {
            _id: res.data[0]._id,
            orderID: res.data[0].orderID,
            status: res.data[0].status,
            parentOrderObjectId: res.data[0].parentOrderObjectId,
          },
        ];
        this.ChildOrder.shippingInfo = shippingInfo;
        this.ChildOrder.status = "pending_shipping_company";
        this.orderService
          .updateChildOrderStatusCustom(this.ChildOrder)
          .subscribe(
            (res: any) => {
              this.toastr.success(res.msg);
              this.loadPaginationData();
            },
            (err) => {
              this.toastr.error(
                "An error occurred in Order:" + res.data[0].orderID
              );
            }
          );
      });
  }

  onSendOrdersToBosta() {
    const matchBostaProvinces = (cty) => {
      let city = "";
      switch (cty) {
        case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©":
          city = "EG-01";
          break;
        case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©":
          city = "EG-01";
          break;
        case "Ø§Ù„Ù‚Ø·Ø§Ù…ÙŠØ©":
          city = "EG-01";
          break;
        case "Ø§Ù„Ø¹Ø¨ÙˆØ±":
          city = "EG-01";
          break;
        case "Ø§Ù„Ø´Ø±ÙˆÙ‚":
          city = "EG-01";
          break;
        case "Ø¨Ø¯Ø±":
          city = "EG-01";
          break;
        case "Ø§Ù„Ø±Ø­Ø§Ø¨":
          city = "EG-01";
          break;
        case "Ø­Ù„ÙˆØ§Ù†":
          city = "EG-01";
          break;
        case "15 Ù…Ø§ÙŠÙˆ":
          city = "EG-01";
          break;
        case "ØªØ¨ÙŠÙ†":
          city = "EG-01";
          break;
        case "Ø´Ø¨Ø±Ø§ Ù…ØµØ±":
          city = "EG-01";
          break;
        case "Ø´Ø¨Ø±Ø§ Ø§Ù„Ø®ÙŠÙ…Ø©":
          city = "EG-01";
          break;
        case "Ø§Ù„Ø¬ÙŠØ²Ø©":
          city = "EG-01";
          break;
        case "6 Ø§ÙƒØªÙˆØ¨Ø±":
          city = "EG-01";
          break;
        case "Ø§Ø¨Ùˆ Ø±ÙˆØ§Ø´":
          city = "EG-01";
          break;
        case "Ø¨Ø±Ø¬ Ø§Ù„Ø¹Ø±Ø¨":
          city = "EG-02";
          break;
        case "Ø§Ù„Ø£Ø³ÙƒÙ†Ø¯Ø±ÙŠØ©":
          city = "EG-02";
          break;
        case "Ø¨Ø¯Ø±Ø´ÙŠÙ†":
          city = "EG-01";
          break;
        case "Ø§Ù„Ø­ÙˆØ§Ù…Ø¯ÙŠØ©":
          city = "EG-01";
          break;
        case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø³Ø§Ø¯Ø§Øª":
          city = "EG-09";
          break;
        case "Ø§Ù„Ø§Ø³Ù…Ø§Ø¹ÙŠÙ„ÙŠØ©":
          city = "EG-11";
          break;
        case "Ø¨ÙˆØ± Ø³Ø¹ÙŠØ¯":
          city = "EG-13";
          break;
        case "Ø³ÙˆÙŠØ³":
          city = "EG-12";
          break;
        case "Ø§Ù„ØºØ±Ø¨ÙŠØ©":
          city = "EG-07";
          break;
        case "Ø·Ù†Ø·Ø§":
          city = "EG-07";
          break;
        case "Ø§Ù„Ø¯Ù‚Ù‡Ù„ÙŠØ©":
          city = "EG-05";
          break;
        case "Ø§Ù„Ù‚Ù„ÙŠÙˆØ¨ÙŠØ©":
          city = "EG-06";
          break;
        case "Ø§Ù„Ø¨Ø­ÙŠØ±Ø©":
          city = "EG-04";
          break;
        case "Ø§Ù„Ø¹Ø§Ø´Ø± Ù…Ù† Ø±Ù…Ø¶Ø§Ù†":
          city = "EG-10";
          break;
        case "Ø§Ù„Ø´Ø±Ù‚ÙŠØ©":
          city = "EG-10";
          break;
        case "Ø§Ù„ÙÙŠÙˆÙ…":
          city = "EG-15";
          break;
        case "ÙƒÙØ± Ø§Ù„Ø´ÙŠØ®":
          city = "EG-08";
          break;
        case "Ø¯Ù…ÙŠØ§Ø·":
          city = "EG-14";
          break;
        case "Ø§Ù„Ù…Ø­Ù„Ø©":
          city = "EG-07";
          break;
        case "Ø§Ù„Ù…Ù†ÙˆÙÙŠØ©":
          city = "EG-09";
          break;
        case "Rest of Delta Cities":
          city = "EG-14";
          break;
        case "ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù†Ø·Ø±ÙˆÙ†":
          city = "EG-04";
          break;
        case "Ø¨Ù†ÙŠ Ø³ÙˆÙŠÙ":
          city = "EG-16";
          break;
        case "Ù…Ù†ÙŠØ§":
          city = "EG-19";
          break;
        case "Ø§Ø³ÙŠÙˆØ·":
          city = "EG-17";
          break;
        case "Ø³ÙˆÙ‡Ø§Ø¬":
          city = "EG-18";
          break;
        case "Ù‚Ù†Ø§":
          city = "EG-20";
          break;
        case "Ø§Ù„Ø£Ù‚ØµØ±":
          city = "EG-22";
          break;
        case "Ø£Ø³ÙˆØ§Ù†":
          city = "EG-21";
          break;
        case "North Coast":
          city = "EG-03";
          break;
        case "Matrouh":
          city = "EG-03";
          break;
        case "Ain-Sokhna":
          city = "EG-12";
          break;
      }
      return city;
    };

    const getBostaShipmentType = (order) => {
      let type = 10;
      if (order.startsWith("S")) {
        type = 10;
      } else if (order.startsWith("R")) {
        type = 25;
      } else if (order.startsWith("M")) {
        type = 30;
      }
      return type;
    };

    this.spinner.show();

    this.selectedChildOrders.forEach(async (order) => {
      await this.orderService.getChildOrderById(order._id).subscribe(
        (res) => {
          const {
            cashOnDelivery,
            receiverName,
            phoneNumber,
            phoneNumber2,
            province,
            streetName,
            product,
            orderID,
          } = res.data;

          const description =
            product.productId +
            "/" +
            product.name +
            "/ (" +
            product.productQty +
            ") ------ ";

          const pickupAddress = {
            firstLine: streetName + " " + province,
            city: matchBostaProvinces(province),
          };
          const dropOffAddress = {
            firstLine: streetName + " " + province,
            city: matchBostaProvinces(province),
          };
          const receiver = {
            firstName: receiverName,
            lastName: ".",
            phone: phoneNumber,
          };

          const shipmentType = getBostaShipmentType(orderID);

          const Delivery = {
            pickupAddress: pickupAddress,
            dropOffAddress: dropOffAddress,
            receiver: receiver,
            cod: cashOnDelivery,
            type: shipmentType,
            businessReference: orderID,
            specs: { packageDetails: { description } },
            notes: phoneNumber2 || "",
          };

          this.shippingService.addOrderToBosta(Delivery).subscribe(
            (res) => {
              const logData = {
                orderID: orderID,
                payload: res,
              };

              this.orderService.createBostaLog(logData).subscribe((res) => {});

              const shippingInfo = {
                trackingNumber: res.data.trackingNumber,
                packageId: res.data._id,
                company: "bosta",
              };

              this.updateChildOrderStatus(orderID, shippingInfo);

              if (orderID.startsWith("M") || orderID.startsWith("S")) {
                const formData = {
                  packageId: res.data._id,
                };

                this.shippingService
                  .getAWBFromBosta(formData)
                  .subscribe((res) => {
                    const saveByteArray = (reportName, byte) => {
                      var blob = new Blob([byte], { type: "application/pdf" });
                      var link = document.createElement("a");
                      link.href = window.URL.createObjectURL(blob);
                      var fileName = reportName;
                      link.download = fileName;
                      link.click();
                    };

                    const base64ToArrayBuffer = (base64) => {
                      var binaryString = window.atob(base64);
                      var binaryLen = binaryString.length;
                      var bytes = new Uint8Array(binaryLen);
                      for (var i = 0; i < binaryLen; i++) {
                        var ascii = binaryString.charCodeAt(i);
                        bytes[i] = ascii;
                      }
                      return bytes;
                    };

                    saveByteArray("awb", base64ToArrayBuffer(res.data.data));
                  });
              }

              this.onChildOrdersTabChanged();
              this.hideSpinner();
            },
            (err) => {
              const logData = {
                orderID,
                payload: err,
              };
              this.orderService.createBostaLog(logData).subscribe((res) => {});
            }
          );
        },
        (err) => {}
      );
    });
  }

  hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 0);
  }

  viewSurveys() {
    this.surveyService
      .getSurveys(this.maxItemPerPage, this.currentPage, this.filterSurveyObj)
      .subscribe(
        (res) => {
          this.surveys = res.data;
          this.noOfItems = res.count;
          this.showPagination = res.count > this.maxItemPerPage ? true : false;
          this.loading = false;
          this.ref.detectChanges();
        },
        (err) => {}
      );
  }

  openCreateSurveyDialog() {
    const dialogRef = this.dialog.open(CreateSurveyDialogComponent, {
      width: "600px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.viewSurveys();
    });
  }

  openGeneratePickListDialog() {
    const dialogRef = this.dialog.open(GeneratePickListDialogComponent, {
      width: "900px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.viewSurveys();
    });
  }

  onEditSurvey(survey) {
    const dialogRef = this.dialog.open(EditSurveyDialogComponent, {
      width: "600px",
      data: survey,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.viewSurveys();
    });
  }

  openFeaturedDialog() {
    this.productService.getTaagerRecommendedGroup().subscribe(
      (res) => {
        const dialogRef = this.dialog.open(EditFeaturedDialogComponent, {
          width: "800px",
          autoFocus: false,
          data: { products: res.data.products },
        });
        dialogRef.afterClosed().subscribe((featuredProducts) => {
          if (featuredProducts) {
            const featuredProductsIds = featuredProducts.map(
              (product) => product._id
            );
            this.productService
              .setTaagerRecommendedGroupProducts(featuredProductsIds)
              .subscribe(
                () => {
                  this.toastr.success("Featured products updated successfully");
                },
                () => {
                  this.toastr.error("Featured products couldn't be updated");
                }
              );
          }
        });
      },
      (err) => {
        if (err.error.msg.code === 3) {
          this.productService.setTaagerRecommendedGroupProducts([]).subscribe(
            (res) => {
              this.openFeaturedDialog();
            },
            () => {
              this.toastr.error("Error: could not create a new featured group");
            }
          );
        }
      }
    );
  }

  onOrderIssueCreated(order): void {
    order.hasIssue = true;
  }
  getSelectedCountry(value, form?) {
    form.controls.country.setValue(value);
    this.setProvincesByCountry(value);
  }
  setProvincesByCountry(country) {
    if (this.selectedIndex == 0 || this.selectedIndex == 1) {
      this.provinces = [];
      this.userCountry = country;
      this.orderSearchFilter.controls.province.setValue(null);
      this.getProvinces(country);
    }
  }
  goToOrderAutomation() {
    window.open(
      `https://${window.location.hostname}/order-management/`,
      "_self"
    );
  }
  goToCMS() {
    window.open(`https://${window.location.hostname}/cms/`, "_self");
  }
}
