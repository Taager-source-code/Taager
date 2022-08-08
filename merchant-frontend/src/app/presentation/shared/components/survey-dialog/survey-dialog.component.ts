import { Component, Inject, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { SurveyService } from 'src/app/presentation/shared/services/survey.service';

@Component({

  selector: 'app-survey-dialog',

  templateUrl: './survey-dialog.component.html',

  styleUrls: ['./survey-dialog.component.scss']

})

export class SurveyDialogComponent implements OnInit {

  survey: any;

  answer: boolean;

  message: string;

  constructor(private surveyService: SurveyService,

              public dialogRef: MatDialogRef<SurveyDialogComponent>,

              @Inject(MAT_DIALOG_DATA) public data: any,

              private toast: ToastrService

              ) { }

  ngOnInit(): void {

    this.survey = this.data;

  }

  onSubmit(): void {

    const body = {answer: this.answer, message: this.message};

    this.surveyService.answerSurvey(this.survey.surveyAnswer._id, body)

      .subscribe(res => {

        this.dialogRef.close();

        if (res.msg === 'Survey is already answered.') {

          this.toast.success('لقد قمت بالإجابة مرة سابقة');

        } else if (res.msg === 'Survey is disabled.') {

          this.toast.error('تم تعطيل هذا الاستبيان');

        } else {

          this.toast.success('تم تسجيل اجابتك');

        }

      }, err => {

        this.toast.error('برجاء المحاوله في وقت لاحق');

      });

  }

  onSkip(): void {

    this.surveyService.skipSurvey(this.survey.surveyAnswer._id).subscribe(res => {

      this.dialogRef.close();

    }, err => {

      this.toast.error('برجاء المحاوله في وقت لاحق');

    });

  }

}
