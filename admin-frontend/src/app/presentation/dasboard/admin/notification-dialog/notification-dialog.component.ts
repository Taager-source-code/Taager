import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { NotificationsService } from "../../services/notifications.service";
@Component({
  selector: "app-notification-dialog-dialog",
  templateUrl: "./notification-dialog.component.html",
  styleUrls: ["./notification-dialog.component.scss"],
})
export class NotificationDialogComponent implements OnInit {
  public notificationForm: FormGroup;
  public title = "";
  public selectedCountry: string = "";
  public message = "";
  public link = "";
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    private notificationsService: NotificationsService
  ) {
    this.notificationForm = new FormGroup({
      title: new FormControl(),
      message: new FormControl(),
      link: new FormControl(),
    });
  }
  reset() {
    this.title = "";
    this.selectedCountry = "";
    this.message = "";
    this.link = "";
    this.notificationForm.reset();
  }
  createNotification() {
    this.title = this.notificationForm.value.title
      ? this.notificationForm.value.title
      : undefined;
    this.message = this.notificationForm.value.message
      ? this.notificationForm.value.message
      : undefined;
    this.link = this.notificationForm.value.link
      ? this.notificationForm.value.link
      : undefined;
    const notification = {
      title: this.title,
      message: this.message,
      link: this.link,
      country: this.selectedCountry,
    };
    if (!notification.title || !notification.message) {
      this.toastr.error("You have to provide a notification title and message");
      return;
    }
    this.sendNotifications(notification);
  }
  sendNotifications(notification) {
    this.notificationsService.createNotification(notification).subscribe(
      (resp: any) => {
        this.toastr.success("تم ارسال اشعار في حساب التاجر");
        this.reset();
      },
      (err) => {
        this.toastr.error("حدث خطأ اثناء ارسال اشعار في حساب التاجر");
      }
    );
    this.notificationsService.sendPushNotification(notification).subscribe(
      (resp: any) => {
        this.toastr.success("تم ارسال اشعار في متصفح التاجر");
        this.reset();
      },
      (err) => {
        this.toastr.error("حدث خطأ اثناء ارسال اشعار في متصفح التاجر");
      }
    );
  }
  getSelectedCountry(value) {
    this.selectedCountry = value;
  }
  ngOnInit(): void {}
}
