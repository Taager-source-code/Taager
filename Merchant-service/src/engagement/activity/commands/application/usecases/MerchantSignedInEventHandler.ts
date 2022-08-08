import { Service } from 'typedi';
import { MerchantEngagementGateway } from '../../infrastructure/gateways/MerchantEngagementGateway';
import { MerchantSignedInEvent } from '../models/MerchantSignedInEvent';

@Service({ global: true })
export class MerchantSignedInEventHandler {
  private merchantEngagementGateway: MerchantEngagementGateway;

  constructor(merchantEngagementGateway: MerchantEngagementGateway) {
    this.merchantEngagementGateway = merchantEngagementGateway;
  }

  public async execute(request: MerchantSignedInEvent): Promise<void> {
    await this.merchantEngagementGateway.sendMerchantSignInEvent(request);
  }
}


