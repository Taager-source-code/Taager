import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({

    styleUrls: [

        'question-box.component.scss'

    ],

    templateUrl: 'question-box.component.html',

    changeDetection: ChangeDetectionStrategy.OnPush,

})

export class QuestionBoxComponent {

    @Input() public currentPageDir: 'ltr' | 'rtl';

    @Input() public maxAllowedAnswers: number;

    @Input() public label: string;

    @Input() public question: string;

    @Input() public iconUrl: string;

    @Input() public youCanChooseMoreThanOneOptionLabel: string;

    @Input() public youCanChooseTwoOptionsLabel: string;

}
