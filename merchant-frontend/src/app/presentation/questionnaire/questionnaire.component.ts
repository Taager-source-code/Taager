import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GetQuestionnaireQuestionsUseCase } from 'src/app/core/usecases/get-questionnaire-questions.usecase';
import { KSA_QUESTIONNAIRE_NAME } from '../shared/constants/questionnaire-name';
import { BannerQuestionnaireService } from '../shared/services/banner-questionnaire.service';
import { AddedToWaitingListComponent } from './components/added-to-waiting-list/added-to-waiting-list.component';
import { ApprovedComponent } from './components/approved/approved.component';
import { Step } from './components/stepper/stepper.component';
import { QuestionnaireEvaluationVerdict } from './shared/interfaces';

const QUESTIONNAIRE_EVALUATION_VERDICT_COMPONENTS: {
    [K in QuestionnaireEvaluationVerdict]: any;
} = {
    approved: ApprovedComponent,
    addedToWaitingList: AddedToWaitingListComponent
};

@Component({
    templateUrl: 'questionnaire.component.html',
    styleUrls: [
        'questionnaire.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireComponent implements OnInit {
    @ViewChild('evaluationVerdictTemplate', {read: ViewContainerRef, static: false})
    private _evaluationVerdictTemplate: ViewContainerRef;

    public userIsReadyToStart = false;
    public userHasBeenEvaluated = false;
    public steps: Array<Step>;

    constructor(
        private getQuestionnaireQuestionsUseCase: GetQuestionnaireQuestionsUseCase,
        private _changeDetectorRef: ChangeDetectorRef,
        private questionnaireService: BannerQuestionnaireService
    ) {
        this.questionnaireService.setCloseButton();
    }

    ngOnInit(): void {
      this.getQuestionnaireQuestionsUseCase.execute(KSA_QUESTIONNAIRE_NAME).subscribe((data) => {
        this.steps = data.questions.map((question, index) => ({
          index: index + 1,
          meta: {
            label: index + 1,
            content: question
          }
        }));
      });
    }

    public confirmStartFillingQuestionnaire(): void {
        this.userIsReadyToStart = true;
    }

    public resolveQuestionnaireEvaluationVerdict(
        verdict: QuestionnaireEvaluationVerdict
    ): void {
        this.userHasBeenEvaluated = true;
        this._commonChangeDetectorDetectChanges();
        const componentToInjectInstance = this._evaluationVerdictTemplate.createComponent(
            QUESTIONNAIRE_EVALUATION_VERDICT_COMPONENTS[verdict]
        );
        componentToInjectInstance.changeDetectorRef.detectChanges();
    }

    private _commonChangeDetectorDetectChanges(): void {
        this._changeDetectorRef.detectChanges();
    }
}


