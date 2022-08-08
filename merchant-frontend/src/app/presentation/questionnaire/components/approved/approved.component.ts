import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOGIN_URL } from 'src/app/presentation/shared/constants';
import { BannerQuestionnaireService } from 'src/app/presentation/shared/services/banner-questionnaire.service';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';

@Component({
    selector: 'app-approved',
    styleUrls: [
        'approved.component.scss',
    ],
    templateUrl: 'approved.component.html',
})
export class ApprovedComponent implements OnInit {

    public changesSection: { img: string; text: string }[];

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private mixpanelService: MixpanelService,
        private _bannerQuestionnaireService: BannerQuestionnaireService
        ) {
            this.trackApprovedQuestionnaire();
    }

    ngOnInit(): void {
        this.changesSection = [
            {
                img: 'change-country.jpeg',
                text: 'ÙŠÙ…ÙƒÙ†Ùƒ ØªØºÙŠÙŠØ± Ø§Ù„Ø¯ÙˆÙ„Ø© Ù…Ù† Ø´Ø±ÙŠØ· Ø§Ù„ØªÙ†Ù‚Ù„',
            },
            {
                img: 'profits.jpeg',
                text: 'ÙŠÙ…ÙƒÙ†Ùƒ Ù…Ø´Ø§Ù‡Ø¯Ø© Ø§Ø±Ø¨Ø§Ø­Ùƒ  ÙÙŠ ÙƒÙ„ Ø¯ÙˆÙ„Ø© Ø¹Ù„Ù‰ Ø­Ø¯Ù‰',
            },
            {
                img: 'catalogue-cart.jpeg',
                text: 'Ø³ØªØ­ØµÙ„ Ø¹Ù„Ù‰ Ø¹Ø±Ø¨Ø© Ùˆ ÙƒØªØ§Ù„ÙˆØ¬ Ù„Ù„Ù…Ù†ØªØ¬Ø§Øª Ù…Ù†ÙØµÙ„ÙŠÙ† Ù„ÙƒÙ„ Ø¯ÙˆÙ„Ø©',
            },
        ];
    }

    onBackToTaagerClick() {
        this._bannerQuestionnaireService.setCloseButton(false);
        this.localStorageService.empty();
        this.router.navigate([LOGIN_URL]);
    }

    public trackApprovedQuestionnaire(){
        this.mixpanelService.track('ksa_questionnaire_passed');
    }
}


