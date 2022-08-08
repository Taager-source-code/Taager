import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../services/user.service";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
@Component({
  selector: "app-order-chat",
  templateUrl: "./order-chat.component.html",
  styleUrls: ["./order-chat.component.scss"],
})
export class OrderChatComponent implements OnInit {
  public orderChatForm: FormGroup;
  public orderObj: any;
  public userType: number;
  public messageLists: any = [];
  public currentUserId: string;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent, { static: false })
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;
  constructor(
    private orderService: OrderService,
    private dilogRef: MatDialogRef<OrderChatComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderChatForm = new FormGroup({
      message: new FormControl("", [
        Validators.required,
        Validators.maxLength(3000),
      ]),
    });
    this.getUserLevel();
  }
  ngOnInit(): void {
    if (this.data.order) {
      this.orderObj = this.data.order;
      this.orderMessageListing(this.orderObj._id);
    }
  }
  closeModal(): void {
    this.markMessageAsRead();
    this.dilogRef.close();
  }
  getUserLevel(): void {
    this.userService.getUserLevel().subscribe((res) => {
      this.userType = res.data;
      if (this.userType === 1) {
        this.currentUserId = this.data.userId;
      } else if (this.userType === 3) {
        this.currentUserId = this.data.adminId;
      }
    });
  }
  public orderMessageListing(orderObjId): void {
    this.orderService.getOrderMessages({ orderObjectId: orderObjId }).subscribe(
      (res) => {
        if (res.data) {
          this.messageLists = res.data;
          setTimeout(() => {
            this.scrollToBottom();
          }, 500);
        }
      },
      (err) => {}
    );
  }
  sendOrderMessage(): void {
    if (this.orderChatForm.valid) {
      const reqObj = {
        orderObjectId: this.orderObj._id,
        orderID: this.orderObj.orderID,
        orderStatus: this.orderObj.status,
      };
      if (this.userType === 1) {
        // tslint:disable-next-line:no-string-literal
        reqObj["userMessage"] = this.orderChatForm.value.message;
        // tslint:disable-next-line:no-string-literal
        reqObj["userId"] = this.data.userId;
      } else if (this.userType === 3) {
        // tslint:disable-next-line:no-string-literal
        reqObj["adminMessage"] = this.orderChatForm.value.message;
        // tslint:disable-next-line:no-string-literal
        reqObj["adminId"] = this.data.adminId;
      }
      this.orderService.addOrderMessage(reqObj).subscribe(
        (res) => {
          this.orderMessageListing(this.orderObj._id);
          this.orderChatForm.reset();
        },
        (err) => {}
      );
    }
  }
  markMessageAsRead(): void {
    const reqObj = {
      type: this.userType === 1 ? "user" : "admin",
      orderObjectId: this.orderObj._id,
    };
    this.orderService.markMessageAsRead(reqObj).subscribe(
      (res) => {},
      (err) => {}
    );
  }
  public scrollToBottom(): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }
}
