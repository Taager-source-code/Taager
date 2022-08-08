import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PRODUCTS_V2_URL } from 'src/app/presentation/shared/constants';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';

@Component({
    styleUrls: [
        'added-to-waiting-list.component.scss',
    ],
    templateUrl: 'added-to-waiting-list.component.html',
})
export class AddedToWaitingListComponent {
    public questionnaireAssets = 'assets/img/questionnaire';

    constructor(
        private router: Router,
        private mixpanelService: MixpanelService,
    ) {
        this.trackWaitingList();
    }

    backToWebsite() {
        this.router.navigate([PRODUCTS_V2_URL]);
    }
    public trackWaitingList(){
        this.mixpanelService.track('ksa_questionnaire_waitlisted');
    }
}


