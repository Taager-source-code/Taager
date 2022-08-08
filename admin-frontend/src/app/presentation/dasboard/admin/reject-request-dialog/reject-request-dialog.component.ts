import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
@Component({
  selector: "app-reject-request-dialog",
  templateUrl: "./reject-request-dialog.component.html",
  styleUrls: ["./reject-request-dialog.component.scss"],
})
export class RejectRequestDialogComponent {
  public reason: string;
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}
  onReject() {
    const request = {
      requestId: this.data.id,
      status: "reject",
      message: this.reason,
    };
    this.orderService.updateRequest(request).subscribe(
      (res: any) => {
        this.toastr.success(res.msg);
        window.location.reload();
      },
      () => {}
    );
  }
}
