import { Service } from 'typedi';
import { MerchantEngagementGateway } from '../../infrastructure/gateways/MerchantEngagementGateway';
import { OrderPlacedEvent } from '../models/OrderCreationEvent';

@Service({ global: true })
export class MerchantOrderPlacedEventHandler {
  private merchantEngagementGateway: MerchantEngagementGateway;

  constructor(merchantEngagementGateway: MerchantEngagementGateway) {
    this.merchantEngagementGateway = merchantEngagementGateway;
  }

  public async execute(event: OrderPlacedEvent): Promise<void> {
    await this.merchantEngagementGateway.sendMerchantOrderPlacedEvent(event);
  }
}


