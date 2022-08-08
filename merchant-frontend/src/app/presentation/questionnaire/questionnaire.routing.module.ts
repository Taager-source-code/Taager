import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire.component';

const ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: QuestionnaireComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
    ],
    exports: [
        RouterModule,
    ]
})
export class QuestionnaireRoutingModule {}


