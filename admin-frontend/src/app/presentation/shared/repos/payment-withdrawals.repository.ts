import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PaymentRequestService } from "src/app/presentation/dashboard/services/paymentRequest.service";
import { WithdrawalsService } from "src/app/presentation/dashboard/services/withdrawals.service";
import { RemoteConfigService } from "../services/remote-config.service";
import { SharedService } from "../services/shared.service";
@Injectable({
  providedIn: "root",
})
export class PaymentWithdrawalsRepository {
  private _currencyFilterFeatureEnabled;
  private _currencyList;
  public currencyFilterFeatureFlagObservable: Observable<boolean>;
  public get currencyList() {
    return this._currencyList;
  }
  public set currencyList(value) {
    this._currencyList = value;
  }
  public get currencyFilterFeatureEnabled() {
    return this._currencyFilterFeatureEnabled;
  }
  public set currencyFilterFeatureEnabled(value) {
    this._currencyFilterFeatureEnabled = value;
  }
  constructor(
    private paymentRequestService: PaymentRequestService,
    private withdrawalsService: WithdrawalsService,
    private remoteConfigService: RemoteConfigService,
    private sharedService: SharedService
  ) {
    this.currencyFilterFeatureFlagObservable =
      this.remoteConfigService.getFeatureFlags("CURRENCY_FILTER_FEATURE");
    this.currencyFilterFeatureFlagObservable.subscribe((flag) => {
      this.currencyFilterFeatureEnabled = flag;
    });
    this.sharedService.getCountriesList().subscribe((countries) => {
      this.currencyList = countries.map((country) => country.currencyIsoCode);
    });
  }
  getPaymentWithdrawalRequest({
    maxItemPerPage,
    currentPage,
    filterRequestedPaymentsObj,
  }): Observable<any> {
    if (this.currencyFilterFeatureEnabled) {
      const validFilters = Object.keys(filterRequestedPaymentsObj)
        .filter((key) => filterRequestedPaymentsObj[key])
        .reduce((resultObject, key) => {
          resultObject[key] = filterRequestedPaymentsObj[key];
          return resultObject;
        }, {});
      return this.withdrawalsService
        .getWithdrawalRequests(maxItemPerPage, currentPage, validFilters)
        .pipe(
          map((res: { data: { count; withdrawals } }) => {
            return {
              count: res.data.count,
              data: res.data.withdrawals.map((withdrawal) => ({
                ...withdrawal,
                _id: withdrawal.id,
                paymentWay: withdrawal.paymentMethod,
                userId: {
                  _id: withdrawal.userId,
                  TagerID: withdrawal.taagerId,
                  firstName: withdrawal.fullName,
                },
              })),
            };
          })
        );
    } else {
      return this.paymentRequestService.getPaymentRequest(
        maxItemPerPage,
        currentPage,
        filterRequestedPaymentsObj
      );
    }
  }
  updatePaymentWithdrawalRequestById(
    id: string,
    payload: {
      amount: number;
      status: string;
      rejectReason?: string;
    }
  ): Observable<any> {
    const withdrawalStatus = this.deserializeStatus(payload.status);
    if (this._currencyFilterFeatureEnabled) {
      return this.withdrawalsService.updateWithdrawalRequest(id, {
        status: withdrawalStatus,
        rejectReason: payload.rejectReason,
      });
    } else {
      return this.paymentRequestService.updatePaymentRequest(id, payload);
    }
  }
  createPaymentWithdrawalRequest({
    paymentRequest,
    currency,
  }): Observable<any> {
    if (this._currencyFilterFeatureEnabled) {
      const newWithdrawalRequest = this.deserializeNewPaymentRequest({
        paymentRequest,
        currency,
      });
      return this.withdrawalsService.createWithdrawalRequest(
        newWithdrawalRequest
      );
    } else {
      return this.paymentRequestService.createPaymentRequest(paymentRequest);
    }
  }
  deserializeNewPaymentRequest({
    paymentRequest: { userId, amount, paymentWay: paymentMethod, phoneNum },
    currency,
  }) {
    return {
      currency,
      userId,
      amount,
      paymentMethod,
      phoneNum,
    };
  }
  deserializeStatus(status) {
    switch (status) {
      case "inprogress":
        return "in-progress";
      case "successful":
        return "accepted";
      default:
        return status;
    }
  }
}
