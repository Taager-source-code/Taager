import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({

    styleUrls: [

        'step-label.component.scss'

    ],

    templateUrl: 'step-label.component.html',

    changeDetection: ChangeDetectionStrategy.OnPush

})

export class StepLabelComponent {

    @Input() public totalPages: number;

    @Input() public currentPage: number;

    @Input() public pageCounterLabel: string;

    @Input() public pageCounterOfLabel: string;

}
