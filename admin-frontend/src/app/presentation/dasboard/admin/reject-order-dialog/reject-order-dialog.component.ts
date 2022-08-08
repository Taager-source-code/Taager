import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
@Component({
  selector: "app-reject-order-dialog",
  templateUrl: "./reject-order-dialog.component.html",
  styleUrls: ["./reject-order-dialog.component.scss"],
})
export class RejectOrderDialogComponent {
  public reason: string;
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}
  onReject() {
    const request = {
      orderId: this.data.id,
      status: "reject",
      message: this.reason,
    };
    this.orderService.updateOrder(request).subscribe(
      (res: any) => {
        this.toastr.success(res.msg);
        // window.location.reload();
      },
      () => {}
    );
  }
}
