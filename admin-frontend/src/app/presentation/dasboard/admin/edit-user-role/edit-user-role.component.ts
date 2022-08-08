import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/user.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

export interface User {
  UserObj: [];
}
interface UserReq {
  userId: string;
  userLevel: number;
  userRole: string;
  userCountriesAccess;
}

@Component({
  selector: "app-edit-user-role",
  templateUrl: "./edit-user-role.component.html",
  styleUrls: ["./edit-user-role.component.scss"],
})
export class EditUserRoleComponent implements OnInit {
  public changeRoleForm: FormGroup;
  public clicked = false;
  public selectedCountries: string[];
  public userCountries: string[] = [];
  public reqObj = {} as UserReq;
  public userRoles = [];

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private formBuilder: FormBuilder
  ) {
    this.changeRoleForm = this.formBuilder.group({
      role: "",
      userCountriesAccess: [],
    });
    this.setUserRoles();
  }

  ngOnInit(): void {}
  updateRole() {
    this.clicked = true;

    if (
      this.changeRoleForm.value.role != "" &&
      this.changeRoleForm.value.role != "-1"
    ) {
      if (this.changeRoleForm.valid && this.changeRoleForm.value) {
        this.reqObj.userRole = this.changeRoleForm.value.role;
        this.reqObj.userLevel = 3;
        this.reqObj.userId = this.data.UserObj["_id"];
        this.changeRoleForm.controls.userCountriesAccess.setValue(
          this.selectedCountries
        );
        this.reqObj.userCountriesAccess =
          this.changeRoleForm.value.userCountriesAccess;
        this.userService.setUserRole(this.reqObj).subscribe(
          (res: any) => {
            this.dialogRef.close();
            this.toastr.success(res.msg);
          },
          (err) => {}
        );
      } else {
        this.clicked = false;
      }
    } else {
      this.toastr.error("please select role");
      this.clicked = false;
    }
  }
  setSelectedCountries(value) {
    this.selectedCountries = value;
  }
  setUserRoles(): void {
    this.userRoles = [
      // {
      //   role: "superAdmin",
      //   roleName: "Super Admin",
      // },
      {
        role: "customerService",
        roleName: "Customer Service",
      },
      {
        role: "orderConfirmationsTeamLeader",
        roleName: "Order Confirmations Team Leader",
      },
      {
        role: "orderConfirmationsTeamMember",
        roleName: "Order Confirmations Team Member",
      },
      {
        role: "products",
        roleName: "Products",
      },
      {
        role: "operations",
        roleName: "Operations",
      },
      // {
      //   role: "wallet",
      //   roleName: "Wallet",
      // },
      {
        role: "returnAndRefunds",
        roleName: "Return And Refunds",
      },
      {
        role: "warehouseInboundAgent",
        roleName: "Warehouse Inbound Agent",
      },
      {
        role: "warehousePicker",
        roleName: "Warehouse Picker",
      },
      {
        role: "warehouseStockController",
        roleName: "Warehouse Stock Controller",
      },
      {
        role: "warehouseUserAdmin",
        roleName: "Warehouse Admin",
      },
      {
        role: "warehouseScanner",
        roleName: "Warehouse Scanner",
      },
      {
        role: "warehouseReturnAgent",
        roleName: "Warehouse Return Agent",
      },
      {
        role: "ksaConfirmationsMember",
        roleName: "KSA Confirmations Member",
      },
    ];
  }
}
