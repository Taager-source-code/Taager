import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "toaster",
  template: ``,
})
export class ToasterComponent implements OnInit {
  @Input() message = "";
  @Input() title = "";
  @Input() type = "success";
  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {
    if (this.type === "success") {
      this.toastr.success(this.message, this.title);
    } else if (this.type === "error") {
      this.toastr.error(this.message, this.title);
    }
  }
}
