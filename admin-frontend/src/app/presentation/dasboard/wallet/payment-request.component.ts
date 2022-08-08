import { Component, Inject, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../services/user.service";
import { NotificationsService } from "../../services/notifications.service";
import { PaymentWithdrawalsRepository } from "../../../shared/repos/payment-withdrawals.repository";
export interface PaymentRequest {
  id: string;
  UserId: string;
  Username: string;
  TagerID: string;
  amount: number;
  paymentWay: string;
  phoneNum: string;
  status: string;
  screenStatus: string;
  maxAmount: number;
  rejectReason: string;
}
@Component({
  selector: "app-payment-request",
  templateUrl: "./payment-request.component.html",
  styleUrls: ["./payment-request.component.scss"],
})
export class PaymentRequestComponent implements OnInit {
  public id = this.data.id;
  public amount = this.data.amount;
  public maxAmount = this.data.maxAmount;
  public paymentWay = this.data.paymentWay;
  public phoneNum = this.data.phoneNum;
  public status = this.data.status;
  public TagerID = this.data.TagerID;
  public UserId = this.data.UserId;
  public Username = this.data.Username;
  public rejectReason = this.data.rejectReason;
  public changeStatus = this.data.screenStatus == "changeStatus" ? true : false;
  public newRequest = this.data.screenStatus == "newRequest" ? true : false;
  public clicked = false;
  public currencyFilterFeatureEnabled = false;
  public selectedCurrency;
  public currencyList = [];
  constructor(
    private userService: UserService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<PaymentRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentRequest,
    private notificationsService: NotificationsService,
    private paymentWithdrawalsRepository: PaymentWithdrawalsRepository
  ) {}
  ngOnInit(): void {
    this.currencyFilterFeatureEnabled =
      this.paymentWithdrawalsRepository.currencyFilterFeatureEnabled;
    this.currencyList = this.paymentWithdrawalsRepository.currencyList;
  }
  onTaagerIdChange() {
    this.userService.getUserByTaagerId(this.TagerID).subscribe((res) => {
      this.toaster.info(res.msg);
      this.UserId = res.data._id;
      this.Username = res.data.firstName;
    });
  }
  onSubmit() {
    this.clicked = true;
    if (this.changeStatus) {
      if (this.status === "rejected" && !this.rejectReason) {
        return this.showError("يجب اعطاء سبب رفض الطلب");
      }
      this.updateRequest();
    } else {
      this.AddNewRequest();
    }
  }
  private showError(msg) {
    this.toaster.error(msg);
    this.clicked = false;
    return 0;
  }
  updateRequest() {
    let requestInfo = {
      status: this.status,
      amount: this.amount,
      userID: this.UserId["_id"],
    };
    if (requestInfo["status"] === "rejected") {
      requestInfo["rejectReason"] = this.rejectReason;
    }
    this.paymentWithdrawalsRepository
      .updatePaymentWithdrawalRequestById(this.id, requestInfo)
      .subscribe(
        (res) => {
          this.dialogRef.close();
          this.toaster.success("Status Updated Successfully");
          this.dialogRef.close();
          if (requestInfo.status === "rejected" && this.TagerID) {
            this.sendNotification(this.TagerID);
          }
        },
        (err) => {
          this.toaster.error(
            err.error.msg || err.error.message || err.error.description
          );
        }
      );
  }
  AddNewRequest() {
    var requestInfo = {
      amount: this.amount,
      paymentWay: this.paymentWay,
      phoneNum: this.phoneNum,
      userId: this.newRequest ? this.UserId : "",
      status: this.newRequest ? this.status : "",
    };
    this.paymentWithdrawalsRepository
      .createPaymentWithdrawalRequest({
        paymentRequest: requestInfo,
        currency: this.selectedCurrency,
      })
      .subscribe(
        (res) => {
          this.dialogRef.close();
          this.toaster.success("تم ارسال طلب الصرف");
          this.dialogRef.close();
          if (requestInfo.status === "rejected" && this.TagerID) {
            this.sendNotification(this.TagerID);
          }
        },
        (err) => {
          this.clicked = false;
          this.toaster.error(
            err.error.msg || err.error.message || err.error.description
          );
        }
      );
  }
  sendNotification(taagerId) {
    const data = {
      title: `تم رفض طلب السحب الخاص بك`,
      message: `تم رفض طلب السحب الخاص بك`,
      link: "/wallet",
      taagerId: taagerId,
    };
    if (this.rejectReason) {
      data.message = `تم رفض طلب السحب الخاص بك بسبب ${this.rejectReason}`;
    }
    this.sendInAppNotification(data);
    this.sendPushNotification(data);
  }
  sendInAppNotification(data) {
    this.notificationsService.createNotification(data).subscribe(
      (response: any) => {},
      (err) => {}
    );
  }
  sendPushNotification(data) {
    this.notificationsService.sendPushNotification(data).subscribe(
      (response: any) => {},
      (err) => {}
    );
  }
}
