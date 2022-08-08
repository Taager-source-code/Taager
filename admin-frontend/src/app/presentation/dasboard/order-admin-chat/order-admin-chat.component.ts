import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { OrderService } from "../../services/order.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
@Component({
  selector: "app-order-chat",
  templateUrl: "./order-admin-chat.component.html",
  styleUrls: ["./order-admin-chat.component.scss"],
})
export class OrderAdminChatComponent implements OnInit {
  public orderChatForm: FormGroup;
  public orderObj: any;
  public adminNoteLists: any = [];
  public currentUserId: string;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent, { static: false })
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;
  constructor(
    private orderService: OrderService,
    private dilogRef: MatDialogRef<OrderAdminChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderChatForm = new FormGroup({
      note: new FormControl("", [
        Validators.required,
        Validators.maxLength(3000),
      ]),
    });
  }
  ngOnInit(): void {
    if (this.data.order) {
      this.orderObj = this.data.order;
      this.orderAdminNoteListing(this.orderObj._id);
    }
  }
  closeModal(): void {
    // this.markMessageAsRead();
    this.dilogRef.close();
  }
  public orderAdminNoteListing(orderObjId): void {
    this.orderService
      .getOrderAdminNotes({ orderObjectId: orderObjId })
      .subscribe(
        (res) => {
          if (res.data) {
            this.adminNoteLists = res.data;
            setTimeout(() => {
              this.scrollToBottom();
            }, 500);
          }
        },
        (err) => {}
      );
  }
  sendOrderNote(): void {
    if (this.orderChatForm.valid) {
      const reqObj = {
        orderObjectId: this.orderObj._id,
        orderID: this.orderObj.orderID,
        orderStatus: this.orderObj.status,
      };
      reqObj["adminNote"] = this.orderChatForm.value.note;
      reqObj["adminId"] = this.data.adminId;
      this.orderService.addOrderAdminNote(reqObj).subscribe(
        (res) => {
          this.orderAdminNoteListing(this.orderObj._id);
          this.orderChatForm.reset();
        },
        (err) => {}
      );
    }
  }
  // markMessageAsRead(): void {
  //   const reqObj = {
  //     type: "admin",
  //     orderObjectId: this.orderObj._id,
  //   };
  //   this.orderService.markMessageAsRead(reqObj).subscribe(
  //     (res) => {},
  //     (err) => {
  //     }
  //   );
  // }
  public scrollToBottom(): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }
}
