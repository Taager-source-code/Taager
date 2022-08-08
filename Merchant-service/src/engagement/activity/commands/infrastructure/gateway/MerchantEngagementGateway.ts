import { RegionEU, TrackClient } from 'customerio-node';
import { Service } from 'typedi';
import Env from '../../../../../Env';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { MerchantSignedUpEvent } from '../../application/models/MerchantSignedUpEvent';
import { MerchantSignedInEvent } from '../../application/models/MerchantSignedInEvent';
import { OrderPlacedEvent } from '../../application/models/OrderCreationEvent';
import { Merchant, MerchantExperience } from '../../application/models/Merchant';

@Service({ global: true })
export class MerchantEngagementGateway {
  private customerIoClient: TrackClient;

  constructor() {
    this.customerIoClient = new TrackClient(Env.CUSTOMER_IO_SITE_ID, Env.CUSTOMER_IO_API_KEY, { region: RegionEU });
  }

  public async sendMerchantSignUpEvent(event: MerchantSignedUpEvent): Promise<void> {
    await this.identifyNewMerchant(event).catch(err => MerchantEngagementGateway.logSignUpError(event, err));
  }

  public async sendMerchantSignInEvent(event: MerchantSignedInEvent): Promise<void> {
    await this.identifyExistingMerchant(event)
      .then(() => this.sendSignInEvent(event))
      .catch(err => MerchantEngagementGateway.logSignInError(event, err));
  }

  public async sendMerchantOrderPlacedEvent(event: OrderPlacedEvent): Promise<void> {
    await this.customerIoClient
      .identify(event.taagerId, {
        _last_visit: MerchantEngagementGateway.getCurrentTimestamp(),
        last_order_date: MerchantEngagementGateway.getCurrentTimestamp(),
      })
      .then(() => this.identifyMerchantOrder(event))
      .catch(err => MerchantEngagementGateway.logOrderCreationError(event, err));
  }
  public async sendMerchantMultiTenancyEnabledEvent(taagerId: string): Promise<void> {
    await this.customerIoClient
      .identify(taagerId, {})
      .then(() => this.identifyMultitenancyEnabledEvent(taagerId))
      .catch(err => MerchantEngagementGateway.logMultitenancyEnabledError(taagerId, err));
  }

  private identifyNewMerchant(event: MerchantSignedUpEvent): Promise<Record<string, any>> {
    const taagerId = event.merchant.taagerId;
    return this.customerIoClient.identify(taagerId, {
      created_at: MerchantEngagementGateway.getCurrentTimestamp(),
      sign_up_source: event.signUpSource.toString(),
      ...MerchantEngagementGateway.convertMerchant(event.merchant),
    });
  }

  private identifyExistingMerchant(event: MerchantSignedInEvent): Promise<Record<string, any>> {
    const taagerId = event.merchant.taagerId;
    return this.customerIoClient.identify(taagerId, {
      ...MerchantEngagementGateway.convertMerchant(event.merchant),
    });
  }

  private static convertMerchant(
    merchant: Merchant,
  ): {
    last_login_date: number;
    _last_visit: number;
    email?: string;
    phone?: string;
    first_name: string;
    loyalty_program: string;
    experience: MerchantExperience;
  } {
    return {
      last_login_date: MerchantEngagementGateway.getCurrentTimestamp(),
      _last_visit: MerchantEngagementGateway.getCurrentTimestamp(),
      email: merchant.email,
      phone: merchant.phone,
      first_name: merchant.fullName,
      loyalty_program: merchant.loyaltyProgram,
      experience: merchant.merchantExperience,
    };
  }

  private identifyMerchantOrder(event: OrderPlacedEvent): Promise<Record<string, any>> {
    const taagerId = event.taagerId;
    return this.customerIoClient.track(taagerId, {
      name: 'order-placed',
      data: {
        order_date: MerchantEngagementGateway.getCurrentTimestamp(),
        orderBusinessId: event.orderBusinessId,
        country: event.country,
        province: event.province,
        cartSize: event.cartSize,
        cashOnDelivery: event.cashOnDelivery,
        endCustomerPhoneNumber: event.endCustomerPhoneNumber,
      },
    });
  }
  private identifyMultitenancyEnabledEvent(taagerId: string): Promise<Record<string, any>> {
    return this.customerIoClient.track(taagerId, {
      name: 'multitenancy-enabled',
      data: {
        enabled_date: MerchantEngagementGateway.getCurrentTimestamp(),
      },
    });
  }

  private async sendSignInEvent(event: MerchantSignedInEvent): Promise<Record<string, any>> {
    return this.customerIoClient.track(event.merchant.taagerId, {
      name: 'sign-in',
    });
  }

  private static logSignInError(event: MerchantSignedInEvent, error: Error): void {
    Logger.error(`Issue while sending a signup event for merchant ${event.merchant.taagerId}. Error: ${error.stack}`);
  }

  private static getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  private static logSignUpError(event: MerchantSignedUpEvent, error: Error): void {
    Logger.error(`Issue while sending a signup event for merchant ${event.merchant.taagerId}. Error: ${error.stack}`);
  }

  private static logOrderCreationError(event: OrderPlacedEvent, error: Error): void {
    Logger.error(
      `Issue while sending an order creation event for merchant ${event.orderBusinessId}. Error: ${error.stack}`,
    );
  }
  private static logMultitenancyEnabledError(taagerId: string, error: Error): void {
    Logger.error(`Issue while sending an multitenancy Enabled event for merchant ${taagerId}. Error: ${error.stack}`);
  }
}


