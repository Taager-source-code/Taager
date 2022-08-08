import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import shipmentTrackingModel from '../../../common/infrastructure/db/schemas/shipmentTracking.model';

class ShipmentTrackingRepository {
  mongooseServiceInstance: any;
  constructor() {
    this.mongooseServiceInstance = new MongooseService(shipmentTrackingModel);
  }

  /**
   * @description Attempt to find Shipment tracking
   * @param query
   * @param options
   * @returns {Promise<result: *|err: *>}
   */
  async findShipmentTrackingBy(trackingNumber, orderID) {
    try {
      const query = {
        trackingNumber,
        orderID,
      };
      return this.mongooseServiceInstance.find(query);
    } catch (err) {
      return err;
    }
  }
}

export = ShipmentTrackingRepository;


