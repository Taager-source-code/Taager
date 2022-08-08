import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionnaireSubmissionModel } from 'src/app/core/domain/questionnaire.model';
import { SubmitQuestionnaireAnswersUseCase } from 'src/app/core/usecases/submit-questionnaire-answers.usecase';
import { KSA_QUESTIONNAIRE_NAME } from 'src/app/presentation/shared/constants/questionnaire-name';
import { QuestionnaireEvaluationVerdict } from '../../shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StepLabelComponent } from '../../shared/step-label/step-label.component';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { QuestionBoxComponent } from '../../shared/question-box/question-box.component';


export interface Step {
    index: number;
    meta: {
        label: any;
        content: any;
    };
}

interface QuestionAndAnswers {
    questionId: string;
    answerIds: Array<string>;
}

@Component({
    selector: 'app-stepper-component',
    styleUrls: [
        'stepper.component.scss'
    ],
    templateUrl: 'stepper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements OnInit, OnDestroy {
    @Input() steps;
    @Input()
    public retrySubmittingQuestionnaire$: Subject<boolean> = new Subject<boolean>();
    @Output()
    public questionnaireEvaluationVerdict$: EventEmitter<QuestionnaireEvaluationVerdict> = new EventEmitter();
    @ViewChild('stepLabelTemplateOutletTemplate', {read: ViewContainerRef}) private _stepLabelTemplateOutletTemplate: ViewContainerRef;
    @ViewChild('stepQuestionBoxOutletTemplate', { read: ViewContainerRef }) private _stepQuestionBoxOutletTemplate: ViewContainerRef;

    public currentPage = 1;
    public currentProgress = 0;
    public showSubmitStep = false;
    public currentActiveStep: Step;
    public isSubmittingQuestionnaire = false;
    public submittingQuestionnaireFailed = false;
    public questionnaireAssetsFolder = 'assets/img/questionnaire';
    public questionnaireForm: FormArray = new FormArray([]);

    private _onDestroy$: Subject<boolean> = new Subject<boolean>();
    private _stepLabelComponentRef: ComponentRef<StepLabelComponent>;
    private _questionBoxComponentRef: ComponentRef<QuestionBoxComponent>;

    constructor(
        private submitQuestionnaireAnswersUseCase: SubmitQuestionnaireAnswersUseCase,
        private toaster: ToastrService,
        private _changeDetectorRef: ChangeDetectorRef,
        private mixpanelService: MixpanelService
    ) { }

    ngOnInit(): void {
        /**
         * These two methods will be moved into the resolution of the server side response
         */
        this._initializeQuestionnaireForm(this.steps);
        this._doCalculateProgress();
    }

    ngOnDestroy(): void {
        this._onDestroy$.next(true);
        this._onDestroy$.complete();
    }

    public moveToPreviousStep(): void {
        if (this.currentPage === 1) {
            return;
        }
        if (this.showSubmitStep) {
            this.showSubmitStep = false;
        } else {
            this.currentPage -= 1;
            this._doCalculateProgress();
        }
    }

    public moveToNextStep(): void {
        if (this.currentPage === this.steps.length) {
            this.showSubmitStep = true;
            return;
        }
        this.currentPage += 1;
        this._doCalculateProgress();
    }

    public canMoveToPrevious(): boolean {
        return this.currentPage !== 1;
    }

    public canMoveToNext(
        stepIndex: number
    ): boolean {
        stepIndex -= 1;
        return this.questionnaireForm.at(stepIndex).valid;
    }

    public submitQuestionnaire(): void {
        const formValue = this._doMapFormGroupArrayToSteps();
        const answers: QuestionnaireSubmissionModel = { answers: formValue };
        this.isSubmittingQuestionnaire = true;
        this.submittingQuestionnaireFailed = false;
        this._commonChangeDetector();
        this.submitQuestionnaireAnswersUseCase
            .execute({ questionnaireName: KSA_QUESTIONNAIRE_NAME, data: answers })
            .pipe(
                takeUntil(this._onDestroy$),
            )
            .subscribe((res: { status: string }) => {
                    switch (res.status) {
                        case 'passed': {
                            this.questionnaireEvaluationVerdict$.emit('approved');
                            break;
                        }
                        case 'failed': {
                            this.questionnaireEvaluationVerdict$.emit('addedToWaitingList');
                            break;
                        }
                    }
                    this.isSubmittingQuestionnaire = false;
                    this.submittingQuestionnaireFailed = false;
                },
                _ => {
                    this.toaster.error('Ø­Ø¯Ø« Ø®Ø·Ø£ Ù…Ø§ØŒ Ù…Ù† ÙØ¶Ù„Ùƒ Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.');
                    this.isSubmittingQuestionnaire = true;
                    this.submittingQuestionnaireFailed = true;
                    this._commonChangeDetector();
                },
                ()=>{
                    this.mixpanelService.track('ksa_questionnaire_submit', answers);
                });
    }

    public doPatchSingleSubFormGroup(
        formIndex: number,
        answerId: string,
    ): void {
        this._commonPatchFormValue(
            formIndex,
            { value: answerId }
        );
    }

    public doPatchMultipleCheckSubFormGroup(
        formIndex: number,
        selectedChoice: string,
        maximumAllowedChoices: number
    ): void {
        let currentMultipleChoicesSelected = (this.questionnaireForm.at(formIndex).get('value').value || []) as Array<string>;
        if (currentMultipleChoicesSelected.indexOf(selectedChoice) !== -1) {
            currentMultipleChoicesSelected = currentMultipleChoicesSelected.filter(choiceVal => choiceVal !== selectedChoice);
        } else {
            if (currentMultipleChoicesSelected.length === maximumAllowedChoices) {
                return;
            }
            currentMultipleChoicesSelected.push(selectedChoice);
        }
        this._commonPatchFormValue(formIndex, { value: currentMultipleChoicesSelected });
    }

    public isMultiChoiceFormOptionDisabled(
        formIndex: number,
        choiceValue: string,
        maximumAllowedChoices: number
    ): boolean {
        const currentMultipleChoicesSelected = this.questionnaireForm.at(formIndex).get('value').value || [];
        return maximumAllowedChoices === currentMultipleChoicesSelected.length && currentMultipleChoicesSelected.indexOf(choiceValue) === -1;
    }

    private _commonChangeDetector(): void {
        this._changeDetectorRef.detectChanges();
    }

    private _doMapFormGroupArrayToSteps(): Array<QuestionAndAnswers> {
        const res: Array<QuestionAndAnswers> = [];
        this.steps.forEach((step, index) => {
            let groupValue = this.questionnaireForm.at(index).get('value').value;
            if (typeof groupValue === 'string') {
                /**
                 * We check for this type so that if later down the line we support text and textArea, we
                 * can submit as array of one value. Also this applies for current situation for a single
                 * choice
                 */
                groupValue = [groupValue];
            }
            res.push({
                questionId: step.meta.content.id,
                answerIds: groupValue
            });
        });
        return res;
    }

    private _commonPatchFormValue(
        index: number,
        formValue: { [control: string]: any },
    ): void {
        this.questionnaireForm.at(index).patchValue({ ...formValue });
    }

    private _initializeQuestionnaireForm(
        steps: Array<Step>,
    ): void {
        steps.forEach(step => {
            let defaultTypeValue: Array<any> | string = '';
            switch (step.meta.content.type) {
                case 'single':
                    defaultTypeValue = '';
                    break;
                case 'multiple':
                    defaultTypeValue = [];
                    break;
            }
            this.questionnaireForm.push(new FormGroup({
                value: new FormControl(defaultTypeValue, [Validators.required])
            }));
        });
    }

    private _doCalculateProgress(): void {
        this.currentActiveStep = this.steps[this.currentPage - 1];
        this._marshallChoicesBasedOnLanguage(this.currentActiveStep.meta.content.answers);
        this.currentProgress = (this.currentPage / this.steps.length) * 100;
        this._commonChangeDetector();
        this._doInjectStepLabel();
        this._doInjectQuestionBox(this.currentActiveStep.meta);
    }

    private _marshallChoicesBasedOnLanguage(
        choicesArray: Array<any>
    ): void {
        const currentUserPageLanguage = this._getCurrentLanguage();
        choicesArray.forEach(choice => {
            choice.languageText = this._returnChoiceTextBasedOnUserLanguage(
                currentUserPageLanguage,
                choice
            );
        });
    }

    private _returnChoiceTextBasedOnUserLanguage(
        language: string,
        choice: any
    ): string {
        switch(language) {
            case 'ar':
                return choice.textArabic;
            case 'en':
                return choice.textEnglish;
            default:
                return choice.textArabic;
        }
    }

    private _doInjectStepLabel(): void {
        this._stepLabelTemplateOutletTemplate.clear();
        if (this._stepLabelComponentRef) {
            this._stepLabelComponentRef.destroy();
        }
        const currentUserPageLanguage = this._getCurrentLanguage();
        const labelsByLanguage = this._returnLabelsByLanguage('stepper', currentUserPageLanguage);
        this._stepLabelComponentRef = this._stepLabelTemplateOutletTemplate.createComponent(StepLabelComponent);
        this._stepLabelComponentRef.instance.totalPages = this.steps.length;
        this._stepLabelComponentRef.instance.currentPage = this.currentPage;
        this._stepLabelComponentRef.instance.pageCounterLabel = labelsByLanguage.pageLabel;
        this._stepLabelComponentRef.instance.pageCounterOfLabel = labelsByLanguage.ofLabel;
        this._stepLabelComponentRef.changeDetectorRef.detectChanges();
    }

    private _doInjectQuestionBox(
        meta: { label: any; content: any }
    ): void {
        this._stepQuestionBoxOutletTemplate.clear();
        if (this._questionBoxComponentRef) {
            this._questionBoxComponentRef.destroy();
        }
        const currentUserPageLanguage = this._getCurrentLanguage();
        const labelsByLanguage = this._returnLabelsByLanguage('questionBox', currentUserPageLanguage);
        this._questionBoxComponentRef = this._stepQuestionBoxOutletTemplate.createComponent(QuestionBoxComponent);
        this._questionBoxComponentRef.instance.currentPageDir = this._doReturnPageOrientation(currentUserPageLanguage);
        this._questionBoxComponentRef.instance.maxAllowedAnswers = meta.content.maxAllowedAnswers;
        this._questionBoxComponentRef.instance.label = meta.label;
        this._questionBoxComponentRef.instance.question = this._doReturnQuestionContentByLanguage(meta.content);
        this._questionBoxComponentRef.instance.iconUrl = meta.content.iconUrl;
        this._questionBoxComponentRef.instance.youCanChooseMoreThanOneOptionLabel = labelsByLanguage.youCanChooseMoreThanOneOptionLabel;
        this._questionBoxComponentRef.instance.youCanChooseTwoOptionsLabel = labelsByLanguage.youCanChooseTwoOptionsLabel;
        this._questionBoxComponentRef.changeDetectorRef.detectChanges();
    }

    private _doReturnPageOrientation(
        currentUserPageLanguage: string,
    ): 'ltr' | 'rtl' {
        const isRTLLang = ['ar'];
        return isRTLLang.indexOf(currentUserPageLanguage) > -1 ? 'rtl' : 'ltr';
    }

    private _doReturnQuestionContentByLanguage(
        content: any,
    ): string {
        const currentUserPageLanguage = this._getCurrentLanguage();
        switch(currentUserPageLanguage) {
            case 'en':
                return content.textEnglish;
            case 'ar':
                return content.textArabic;
            default:
                return content.textArabic;
        }
    }

    private _returnLabelsByLanguage(
        uiSection: string,
        language: string,
    ): {[attribute: string]: string} {
        const labelsByLanguage = {
            stepper: {
                en: {
                    ofLabel: 'of',
                    pageLabel: 'Question',
                },
                ar: {
                    ofLabel: 'Ù…Ù†',
                    pageLabel: 'Ø§Ù„Ø³Ø¤Ø§Ù„',
                }
            },
            questionBox: {
                en: {
                    youCanChooseMoreThanOneOptionLabel: 'You can choose more than one option',
                    youCanChooseTwoOptionsLabel: 'You can choose two options',
                },
                ar: {
                    youCanChooseMoreThanOneOptionLabel: 'ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ø®ØªÙŠØ§Ø± Ø£ÙƒØ«Ø± Ù…Ù† Ø®ÙŠØ§Ø±',
                    youCanChooseTwoOptionsLabel: 'ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ø®ØªÙŠØ§Ø± Ø§Ø®ØªÙŠØ§Ø±ÙŠÙ†',
                }
            }
        };
        return labelsByLanguage[uiSection][language];
    }

    private _getCurrentLanguage(): string {
        return document.documentElement.lang;
    }
}


