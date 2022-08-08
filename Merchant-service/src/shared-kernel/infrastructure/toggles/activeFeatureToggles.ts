import { isEnabled } from './featureToggles';
import Logger from '../logging/general.log';

export const isShippingDiscountEnabled = tagerId => {
  const enabled = isEnabled('shipping-discount', tagerId);
  Logger.info(`Toggle shipping-discount is enabled : ${enabled}`);
  return enabled;
};

export const isRamadanBlockEnabled = tagerId => {
  const enabled = isEnabled('ramadan-block', tagerId);
  Logger.info(`Toggle ramadan-block is enabled : ${enabled}`);
  return enabled;
};

export const isBlanketRamadanBlockEnabled = tagerId => {
  const enabled = isEnabled('blanket-ramadan-block', tagerId);
  Logger.info(`Toggle blanket-ramadan-block is enabled : ${enabled}`);
  return enabled;
};
export const isEndCustomerSpammerBlockEnabled = tagerId => {
  const enabled = isEnabled('end-customer-spammer-block', tagerId);
  Logger.info(`Toggle end-customer-spammer-block is enabled : ${enabled}`);
  return enabled;
};

export const isWithdrawalRequestBlockDatesActivated = () => {
  const blockStart = new Date('2022-07-08T15:00:00.000Z');
  const blockEnd = new Date('2022-07-17T07:00:00.000Z');
  const currentTime = new Date();

  return currentTime > blockStart && currentTime < blockEnd;
};


