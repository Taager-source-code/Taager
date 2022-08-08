import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ISAuthenticatedService } from "../../Services/isAuth.service";
@Component({
  selector: "app-welcome-message",
  templateUrl: "./welcome-message.component.html",
  styleUrls: ["./welcome-message.component.scss"],
})
export class WelcomeMessageComponent implements OnInit {
  constructor(
    private isAuth: ISAuthenticatedService,
    private router: Router,
    public dialogRef: MatDialogRef<WelcomeMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
  public onProductClick() {
    this.dialogRef.close();
    this.router.navigate(["admin"]);
  }
  public onLogoutClick() {
    this.dialogRef.close();
    this.isAuth.logout();
    this.router.navigate(["/login"]);
  }
}
