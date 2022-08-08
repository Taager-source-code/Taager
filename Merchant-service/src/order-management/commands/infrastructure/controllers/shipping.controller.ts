import Env from '../../../../Env';
import joi from 'joi';
import { NOT_FOUND, UNPROCESSABLE_ENTITY, OK, INTERNAL_SERVER_ERROR } from 'http-status';

import axios, { AxiosRequestConfig } from 'axios';
import { AramexOrderStatus, trackAramexOrder } from '../../application/usecases/shipping/shipping.service';

import { VHubsShipmentStatus, trackVHubsOrder } from '../../application/usecases/shipping/vhubsShipping.service';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';

const mapAramexOrderStatus = aramexOrderStatus => {
  switch (aramexOrderStatus) {
    case AramexOrderStatus.ARAMEX_ORDER_CREATED:
    case AramexOrderStatus.ARAMEX_ORDER_TRACKING_RESULTS_SUCCESS:
      return OK;
    case AramexOrderStatus.ARAMEX_ORDER_FAILED:
    case AramexOrderStatus.ARAMEX_ORDER_TRACKING_RESULTS_FAIL:
      return INTERNAL_SERVER_ERROR;
    default:
      return OK;
  }
};

const mapVHubsOrderStatus = vhubsOrderStatus => {
  switch (vhubsOrderStatus) {
    case VHubsShipmentStatus.SHIPMENT_TRACKING_RESULTS_SUCCESS:
      return OK;
    case VHubsShipmentStatus.SHIPMENT_TRACKING_RESULTS_FAIL:
      return INTERNAL_SERVER_ERROR;
    default:
      return OK;
  }
};

export const trackBostaOrder = async (req, res) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://tracking.bosta.co/shipments/track/${req.body.trackingNumber}`,
    headers: {
      authorization: Env.BOSTA_API_KEY,
      'X-Requested-By': 'Taager',
    },
    data: '',
  };
  axios(config).then(
    result => {
      return res.status(OK).json({
        msg: 'Order tracking record retreived successfully!',
        data: result.data,
      });
    },
    err => {
      Logger.error(`error while tracking order with Bosta:${err.stack}`, {
        trackingNumber: req.body.trackingNumber,
      });

      return res.status(NOT_FOUND).json({
        msg: 'Order tracking record retreiving failed!',
      });
    },
  );
};

/**
 * @swagger
 * /api/shipping/aramex-track
 *   post:
 *     description: Track aramex order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - trackingNumber
 *         description: Aramex's Tracking Number of the created order.
 *         in: body
 *         required: true
 *         type: number
 *     responses:
 *       200
 *        description: You get results to track the order successfully.
 *       422
 *        description: Wrong data you entered or missing some data.
 *       500
 *        description: Faild to track aramex order due to internal server error.
 */
export const trackOrderFromAramex = async (req, res) => {
  const schema = joi.object({
    trackingNumber: [joi.number().required(), joi.string().required()],
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  const { status, response } = await trackAramexOrder(body.trackingNumber);
  return res.status(mapAramexOrderStatus(status)).json(response);
};

export const trackOrderFromVHubs = async (req, res) => {
  const schema = joi.object({
    trackingNumber: joi.string().required(),
    orderID: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  const { status, response } = await trackVHubsOrder(body);
  return res.status(mapVHubsOrderStatus(status)).json(response);
};


