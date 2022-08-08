import { Service } from 'typedi';
import { MerchantEngagementGateway } from '../../infrastructure/gateways/MerchantEngagementGateway';
import { MerchantSignedUpEvent } from '../models/MerchantSignedUpEvent';

@Service({ global: true })
export class MerchantSignedUpEventHandler {
  private merchantEngagementGateway: MerchantEngagementGateway;

  constructor(merchantEngagementGateway: MerchantEngagementGateway) {
    this.merchantEngagementGateway = merchantEngagementGateway;
  }

  public async execute(request: MerchantSignedUpEvent): Promise<void> {
    await this.merchantEngagementGateway.sendMerchantSignUpEvent(request);
  }
}


