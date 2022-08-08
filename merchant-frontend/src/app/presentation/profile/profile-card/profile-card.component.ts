import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs/operators';
import { UserModel } from 'src/app/core/domain/user.model';
import { GetUserUseCase } from 'src/app/core/usecases/get-user.usecase';
import { ACCOUNT_TYPES } from 'src/app/presentation/shared/constants';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  public user: UserModel;
  public userFullName: string;
  public accountType = 'BLUE';
  public accountTypeName = 'Ø§Ù„ÙØ¦Ø© Ø§Ù„Ø²Ø±Ù‚Ø§Ø¡';
  public accountPoints;
  public shouldShowMultitenancyTooltip: boolean;
  public accountTypes = ACCOUNT_TYPES.ACCOUNT_TYPE_NAME__TRANSLATION;

  constructor(
    private toast: ToastrService,
    private localStorageService: LocalStorageService,
    private getUserUseCase: GetUserUseCase,
    private multitenancyService: MultitenancyService,
  ) { }

  ngOnInit(): void {
    this.shouldShowMultitenancyTooltip = this.multitenancyService.isMultitenancyEnabled();
    this.getUser();
  }

  onNotifyReferralCodeCopied() {
    this.toast.info('Copied to clipboard');
  }

  private getUser(): void {
    this.getUserUseCase
        .execute()
        .pipe(take(1))
        .subscribe(user => {
          if (user) {
            this.user = user;
            this.setUserFullName(user);
            this.getLoyaltyProgram(user);
          }
        });
  }

  /**
   * set the full name of the user
   */
  private setUserFullName(user: UserModel): void {
    this.userFullName =
      user.fullName === 'Default'? user.firstName + ' ' + user.lastName : user.fullName;
  }

  /**
   * get user loyalty program
   */
  private getLoyaltyProgram(storedUser: UserModel): void {
    const userLoyaltyProgram = storedUser.loyaltyProgram;
    this.accountType = userLoyaltyProgram?.loyaltyProgram;
    this.accountTypeName = ACCOUNT_TYPES.ACCOUNT_TYPE_NAME__TRANSLATION[this.accountType] || '';
    this.accountPoints = userLoyaltyProgram?.points;
  }
}


