import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { ToastrService } from "ngx-toastr";
import { UtilityService } from "../../services/utility.service";
@Component({
  selector: "app-extract-users-dialog",
  templateUrl: "./extract-users-dialog.component.html",
  styleUrls: ["./extract-users-dialog.component.scss"],
})
export class ExtractUsersDialogComponent implements OnInit {
  public status;
  public users = [];
  public clicked = false;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private utilityService: UtilityService
  ) {}
  ngOnInit(): void {}
  getUsersExtract(): void {
    this.clicked = true;
    this.userService.viewUsersExtract().subscribe(
      (res: any) => {
        this.users = res.data;
        if (!this.users || !this.users.length) {
          return;
        }
        this.utilityService.extractToExcel(this.users, "Users.csv");
        this.clicked = false;
      },
      (err) => {
        this.toastr.error(err.error.msg);
        this.clicked = false;
      }
    );
  }
}
