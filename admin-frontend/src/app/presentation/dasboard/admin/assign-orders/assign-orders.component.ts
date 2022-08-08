import { Component, OnInit, Inject } from "@angular/core";
import { UserService } from "../../services/user.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../services/order.service";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
@Component({
  selector: "app-assign-orders",
  templateUrl: "./assign-orders.component.html",
  styleUrls: ["./assign-orders.component.scss"],
})
export class AssignOrdersComponent implements OnInit {
  public admins = [];
  public selectedAdmin;
  public selectedOrders = this.data.orders;
  public adminsName: string[] = [];
  public dropdownSettings: DropdownSettings;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AssignOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getAllAdmins();
    this.setupDropdownSettings();
  }

  getAllAdmins() {
    this.userService.getAdminUsers().subscribe((res) => {
      const admins = [];
      res.data.forEach((element) => {
        if (element.userRole) {
          admins.push(element);
        }
      });
      this.admins = admins
        .filter(
          (x) =>
            x.userRole.role === "orderConfirmationsTeamMember" ||
            x.userRole.role === "orderConfirmationsTeamLeader" ||
            x.userRole.role === "ksaConfirmationsMember"
        )
        .map((x) => ({
          id: x._id,
          name: x.fullName,
          TagerID: x.TagerID,
          role: x.userRole.role,
        }));

      this.adminsName = this.admins.map((x) => x.name);
    });
  }
  onSubmit() {
    const reqObj = {
      orders: this.selectedOrders,
      admin: {
        id: this.selectedAdmin[0].id,
        name: this.selectedAdmin[0].name,
        tagerId: this.selectedAdmin[0].TagerID,
      },
      assignedAt: new Date(),
    };

    this.orderService.assignOrdersToAdmin(reqObj).subscribe(
      (res) => {
        this.dialogRef.close();
        this.toastr.success(res.msg, "", { timeOut: 25000 });
      },
      (err) => {
        this.toastr.success(err);
      }
    );
  }

  setupDropdownSettings(): void {
    this.dropdownSettings = {
      enableSearchFilter: true,
      text: "Select an Admin",
      searchPlaceholderText: "Search name",
      singleSelection: true,
      enableCheckAll: false,
      maxHeight: 280,
      lazyLoading: false,
      showCheckbox: false,
      position: "bottom",
      autoPosition: false,
      escapeToClose: false,
      primaryKey: "name",
      labelKey: "name",
    };
  }
}
