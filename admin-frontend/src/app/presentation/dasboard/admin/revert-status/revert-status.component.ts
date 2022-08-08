import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
export interface Order {
  OrderObj: [];
}
interface OrderStatusReq {
  status: string;
  order: [];
  orders: [];
}
@Component({
  selector: "app-revert-status",
  templateUrl: "./revert-status.component.html",
  styleUrls: ["./revert-status.component.scss"],
})
export class RevertStatusComponent implements OnInit {
  public orderStatuses = [];
  public OrderObj = this.data.OrderObj;
  public currentStatus = "";
  public changeOrderStatusForm: FormGroup;
  public clicked = false;
  public reqObj = {} as OrderStatusReq;
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<RevertStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private formBuilder: FormBuilder
  ) {
    this.changeOrderStatusForm = new FormGroup({
      status: new FormControl(),
    });
    this.currentStatus = this.data.OrderObj["status"];
  }
  ngOnInit(): void {}
  updateStatus() {
    this.clicked = true;
    if (this.changeOrderStatusForm.valid && this.changeOrderStatusForm.value) {
      this.reqObj.status = this.changeOrderStatusForm.value.status;
      this.reqObj.order = this.OrderObj;
      this.orderService.revertOrderStatus(this.reqObj).subscribe(
        (res: any) => {
          this.dialogRef.close();
          this.toastr.success(res.msg);
        },
        (err) => {}
      );
    } else {
      this.clicked = false;
    }
  }
}
