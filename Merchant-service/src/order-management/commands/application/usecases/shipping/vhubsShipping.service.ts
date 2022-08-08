import ShipmentTrackingRepository from '../../../../queries/infrastructure/repositories/shipmentTracking.repository';

const ShipmentTrackingRepositoryInstance = new ShipmentTrackingRepository();

export const VHubsShipmentStatus = {
  SHIPMENT_TRACKING_RESULTS_SUCCESS: 'vhubs_shipment_tracking_results_success',
  SHIPMENT_TRACKING_RESULTS_FAIL: 'vhubs_shipment_tracking_results_fail',
};

export const trackVHubsOrder = async packageInfo => {
  const { trackingNumber, orderID } = packageInfo;

  const tracking = await ShipmentTrackingRepositoryInstance.findShipmentTrackingBy(trackingNumber, orderID);
  if (tracking) {
    return {
      status: VHubsShipmentStatus.SHIPMENT_TRACKING_RESULTS_SUCCESS,
      response: {
        msg: 'VHubs shipment tracking retreived succesfully!',
        data: tracking,
      },
    };
  }

  return {
    status: VHubsShipmentStatus.SHIPMENT_TRACKING_RESULTS_FAIL,
    response: {
      msg: 'VHubs shipment tracking retreiving failed!',
      data: [],
    },
  };
};


