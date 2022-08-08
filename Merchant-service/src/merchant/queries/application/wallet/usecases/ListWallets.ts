import { Service } from 'typedi';
import Wallet from '../models/Wallet';
import WalletRepo from '../../../infrastructure/wallet/WalletRepo';
import IsMultiTenancyEnabled from '../../../../../shared-kernel/application/usecases/IsMultiTenancyEnabled';
import IsMultiTenancyUAEEnabled from '../../../../../shared-kernel/application/usecases/IsMultiTenancyUAEEnabled';

@Service({ global: true })
export default class ListWallets {
  private walletRepo: WalletRepo;
  private isMultiTenancyEnabled: IsMultiTenancyEnabled;
  private isMultiTenancyUAEEnabled: IsMultiTenancyUAEEnabled;

  constructor(
    walletRepo: WalletRepo,
    isMultiTenancyEnabled: IsMultiTenancyEnabled,
    isMultiTenancyUAEEnabled: IsMultiTenancyUAEEnabled,
  ) {
    this.walletRepo = walletRepo;
    this.isMultiTenancyEnabled = isMultiTenancyEnabled;
    this.isMultiTenancyUAEEnabled = isMultiTenancyUAEEnabled;
  }

  async execute(user: any, currency: string): Promise<Wallet[]> {
    const wallets = await this.walletRepo.list(user._id, currency);
    return await this.createEmptyWalletForEachMissingCurrency(user, currency, wallets);
  }

  private async createEmptyWalletForEachMissingCurrency(user, currency: string, wallets: Wallet[]): Promise<Wallet[]> {
    const isMultiTenancyEnabled = await this.isMultiTenancyEnabled.execute(user.TagerID);
    const isMultiTenancyUAEEnabled = await this.isMultiTenancyUAEEnabled.execute(user.TagerID);
    const currencies = ['EGP'];
    if (isMultiTenancyEnabled) {
      currencies.push('SAR');
    }
    if (isMultiTenancyUAEEnabled) {
      currencies.push('AED');
    }
    const requiredCurrencies = currency ? [currency] : currencies;
    return requiredCurrencies.map(currency => {
      const wallet = wallets.find(wallet => wallet.currency == currency);
      return this.createWalletIfNotExists(currency, wallet);
    });
  }

  private createWalletIfNotExists = (currency: string, wallet?: Wallet) => {
    if (wallet) return wallet;
    else
      return {
        ordersCountForExpectedAmount: 0,
        eligibleAmount: 0,
        expectedAmount: 0,
        currency: currency,
      };
  };
}


