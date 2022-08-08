import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { SurveyService } from "../../services/survey.service";
@Component({
  selector: "app-edit-survey-dialog",
  templateUrl: "./edit-survey-dialog.component.html",
  styleUrls: ["./edit-survey-dialog.component.scss"],
})
export class EditSurveyDialogComponent implements OnInit {
  formData: any;
  constructor(
    public dialogRef: MatDialogRef<EditSurveyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private surveyService: SurveyService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.formData = { ...this.data };
  }
  onSubmitForm(): void {
    this.surveyService
      .editSurvey(
        this.formData._id,
        this.formData.name,
        this.formData.isEnabled
      )
      .subscribe(
        () => {
          this.dialogRef.close();
        },
        () => {
          this.toastr.error("An error occurred");
        }
      );
  }
}
