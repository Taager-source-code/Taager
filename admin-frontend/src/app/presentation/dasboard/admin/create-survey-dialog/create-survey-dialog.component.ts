import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { SurveyService } from "../../services/survey.service";
@Component({
  selector: "app-create-survey-dialog",
  templateUrl: "./create-survey-dialog.component.html",
  styleUrls: ["./create-survey-dialog.component.scss"],
})
export class CreateSurveyDialogComponent implements OnInit {
  formData = {
    surveyQuestion: "",
    surveyName: "",
    isEnabled: false,
    activeInDays: null,
  };
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<CreateSurveyDialogComponent>,
    private surveyService: SurveyService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}
  onSubmitForm() {
    this.loading = true;
    this.surveyService
      .createSurvey(
        this.formData.surveyQuestion,
        this.formData.surveyName,
        this.formData.isEnabled,
        this.formData.activeInDays
      )
      .subscribe(
        (res) => {
          this.loading = false;
          this.dialogRef.close();
          this.toastr.success("Survey created successfully");
        },
        (err) => {
          this.loading = false;
          this.toastr.error("An error occured");
        }
      );
  }
}
