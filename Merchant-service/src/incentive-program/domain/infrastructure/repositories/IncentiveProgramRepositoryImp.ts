import MongooseService from '../../../shared-kernel/infrastructure/db/mongoose';
import MerchantIncentiveProgramModel from './../models/mongodb/MerchantIncentiveProgram.model';
import IncentiveProgramModel from './../models/mongodb/IncentiveProgram.model';

import OrderModel from '../../../order-management/common/infrastructure/db/schemas/order.model';
import IncentiveProgramMapper from '../mappers/IncentiveProgramMapper';

import * as validations from '../../../authentication/commands/infrastructure/utils/validations';
import IncentiveProgramRepository from './../../domain/contracts/IncentiveProgramRepository';
import IncentiveProgram from '../../domain/models/incentive-program/IncentiveProgram';
import { Service } from 'typedi';

@Service({ global: true })
export default class IncentiveProgramRepositoryImp implements IncentiveProgramRepository {
  private merchantIncentiveCollection: any;
  private incentiveCollection: any;
  private ordersCollections: any;

  constructor() {
    this.merchantIncentiveCollection = new MongooseService(MerchantIncentiveProgramModel);
    this.incentiveCollection = new MongooseService(IncentiveProgramModel);

    // TODO(Should be moved to the order repository after merging with refactored branches)
    this.ordersCollections = new MongooseService(OrderModel);
  }

  // TODO(Should be moved to the order repository after merging with refactored branches)
  async getConfirmedOrdersCount(TagerID, startDate, endDate): Promise<number> {
    const confirmedOrderStatues = [
      'delivered',
      'return_verified',
      'return_in_progress',
      'delivery_in_progress',
      'refund_in_progress',
      'replacement_in_progress',
      'customer_refused',
      'refund_verified',
      'replacement_verified',
      'pending_shipping_company',
      'delayed',
      'order_addition_inprogress',
      'confirmed',
      'order_addition',
      'delivery_suspended',
      'delivery_cancelled',
      'delivery_cancelled',
      'cancelled',
    ];
    return this.ordersCollections.count({
      TagerID,
      country: 'EGY',
      status: { $in: confirmedOrderStatues },
      createdAt: { $gte: startDate, $lt: endDate },
    });
  }

  // /**
  //  * Adds new incentive program
  //  * @param {IncentiveProgram} incentiveProgram
  //  * @returns {Promise<*>}
  //  */
  // async add(incentiveProgram) {
  //   const dbEntity = IncentiveProgramMapper.toDbEntity(incentiveProgram);
  //   await this.merchantIncentiveCollection.create(dbEntity);
  // }

  /**
   * Gets the default incentive program or null if there is no default one
   * @returns {Promise<?IncentiveProgram>}
   */
  async getDefaultIncentiveProgram(): Promise<IncentiveProgram | null> {
    const dbEntity = await this.incentiveCollection.findOne({
      default: true,
    });

    if (!dbEntity) return null;

    return IncentiveProgramMapper.toDomain(dbEntity);
  }

  /**
   * Gets the merchant's incentive program or null
   * @param tagerID
   * @returns {Promise<?IncentiveProgram>}
   */
  async getByTagerId(tagerID): Promise<IncentiveProgram | null> {
    const dbEntity = await MerchantIncentiveProgramModel.aggregate()
      .lookup({
        from: 'incentiveprograms',
        localField: 'incentiveProgramID',
        foreignField: '_id',
        as: 'IncentiveProgram',
      })
      .match({ tagerID })
      .exec();

    if (validations.isEmptyObject(dbEntity)) return null;
    return IncentiveProgramMapper.toDomain(dbEntity[0].IncentiveProgram[0]);
  }
}


