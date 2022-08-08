import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddedToWaitingListComponent } from './components/added-to-waiting-list/added-to-waiting-list.component';
import { ApprovedComponent } from './components/approved/approved.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionnaireRoutingModule } from './questionnaire.routing.module';
import { QuestionBoxComponent } from './shared/question-box/question-box.component';
import { StepLabelComponent } from './shared/step-label/step-label.component';

const SUB_COMPONENTS = [
    StepperComponent,
    AddedToWaitingListComponent,
    ApprovedComponent,
];

const DYNAMICALLY_INJECTED_COMPONENTS = [
    StepLabelComponent,
    QuestionBoxComponent,
];

@NgModule({
    declarations: [
        QuestionnaireComponent,
        ...SUB_COMPONENTS,
        ...DYNAMICALLY_INJECTED_COMPONENTS,
    ],
    exports: [],
    imports: [
        QuestionnaireRoutingModule,
        CommonModule,
        MatProgressBarModule,
        ReactiveFormsModule,
    ],
})
export class QuestionnaireModule {}


