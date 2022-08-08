import { Service } from 'typedi';
import { MerchantEngagementGateway } from '../../infrastructure/gateways/MerchantEngagementGateway';

@Service({ global: true })
export class MerchantMultiTenancyEnabledEventHandler {
  private merchantEngagementGateway: MerchantEngagementGateway;

  constructor(merchantEngagementGateway: MerchantEngagementGateway) {
    this.merchantEngagementGateway = merchantEngagementGateway;
  }

  public async execute(taagerId: string): Promise<void> {
    await this.merchantEngagementGateway.sendMerchantMultiTenancyEnabledEvent(taagerId);
  }
}


