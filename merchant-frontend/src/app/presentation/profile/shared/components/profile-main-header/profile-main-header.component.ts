import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-profile-main-header',
    styleUrls: [
        'profile-main-header.component.scss'
    ],
    templateUrl: 'profile-main-header.component.html'
})
export class ProfileMainHeaderComponent {
    @Input() iconUrl: string;
    @Input() headerText: string;
    @Input() subHeaderText: string;
}


