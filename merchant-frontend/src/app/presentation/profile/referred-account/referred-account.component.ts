import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/core/domain/user.model';
import { PROFILE_URL, REGISTER_URL } from '../../shared/constants';
import { profileComponentsAssetsPathToken } from '../shared/config/profile.component.assets.path.config';
import { GetReferralsUseCase } from 'src/app/core/usecases/get-referrals.usecase';
import { ReferralsModel } from 'src/app/core/domain/referrals.model';

@Component({
    selector: 'app-referred-account',
    styleUrls: [
        'referred-account.component.scss'
    ],
    templateUrl: 'referred-account.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferredAccountComponent implements OnInit, OnDestroy {
    @Input() user: UserModel;
    public countOrders: number;
    public countUsers: number;
    private onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(profileComponentsAssetsPathToken) public assetsPath: string,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private clipboard: Clipboard,
        private toastrService: ToastrService,
        private getReferralsUseCase: GetReferralsUseCase,
    ) {}

    ngOnInit(): void {
        this.getReferrals();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public copyReferralLink(): void {
        const baseHref = window.location.href.replace(PROFILE_URL, '');
        const referralLink = baseHref + this.router.serializeUrl(this.router.createUrlTree([REGISTER_URL, this.user.referralCode]));
        this.clipboard.copy(referralLink);
        this.toastrService.info('Copied to clipboard');
    }

    private getReferrals(): void {
        this.getReferralsUseCase
            .execute()
            .pipe(
                takeUntil(this.onDestroy$),
            ).subscribe((referrals: ReferralsModel) => {
                this.countUsers = referrals.countUsers;
                this.countOrders = referrals.countOrders;
                this.changeDetectorRef.detectChanges();
            }, err => {
                this.toastrService.error('Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø´Ø§Ø± Ø¥Ù„ÙŠÙ‡Ø§ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±ÙŠ');
            });
    }
}


