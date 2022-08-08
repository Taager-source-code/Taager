import axios, { AxiosRequestConfig } from 'axios';
import Env from '../../../../../Env';

const getTrackingResults = async (trackingNumber): Promise<any> => {
  const aramexTrackingOrderData = {
    ClientInfo: {
      UserName: Env.ARAMEX_USER_NAME,
      Password: Env.ARAMEX_PASSWORD,
      Version: 'v1',
      AccountNumber: Env.ARAMEX_ACCOUNT_NUMBER,
      AccountPin: Env.ARAMEX_ACCOUNT_PIN,
      AccountEntity: 'CAI',
      AccountCountryCode: 'EG',
      Source: 24,
    },
    Shipments: [trackingNumber],
  };

  const orderTrackingConfig: AxiosRequestConfig = {
    method: 'post',
    url: Env.ARAMEX_TRACK_SHIPMENTS_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: aramexTrackingOrderData,
  };

  try {
    let errors = '';
    let trackingResults = null;

    const result = await axios(orderTrackingConfig);

    if (result.data.HasErrors) {
      errors = 'Error happend while getting order tracking results';
    }
    if (!result.data.TrackingResults.length) {
      errors = 'There is no Existing Way bills with this trackingNumber';
    } else if (!result.data.TrackingResults[0].Value.length) {
      errors = 'There is no Existing Way bills with this trackingNumber';
    } else {
      trackingResults = result.data.TrackingResults[0].Value;
    }

    return { trackingResults, errors };
  } catch (error) {
    console.log(error);
  }
};

export const trackAramexOrder = async trackingNumber => {
  try {
    const { trackingResults, errors: trackingErrors } = await getTrackingResults(trackingNumber);

    if (trackingErrors) {
      return {
        status: AramexOrderStatus.ARAMEX_ORDER_TRACKING_RESULTS_FAIL,
        response: {
          msg: 'Un-able to get aramex order Tracking Results',
          trackingResults: null,
          errors: trackingErrors,
        },
      };
    }

    return {
      status: AramexOrderStatus.ARAMEX_ORDER_TRACKING_RESULTS_SUCCESS,
      response: {
        msg: 'Got aramex order Tracking Results Successfully',
        trackingResults,
        errors: null,
      },
    };
  } catch (error) {
    return {
      status: AramexOrderStatus.ARAMEX_ORDER_TRACKING_RESULTS_FAIL,
      response: {
        msg: 'Aramex Order package creating failed!',
        trackingResults: null,
        errors: null,
      },
    };
  }
};

export const AramexOrderStatus = {
  ARAMEX_ORDER_CREATED: 'aramex_order_created',
  ARAMEX_ORDER_FAILED: 'aramex_order_failed',
  ARAMEX_ORDER_TRACKING_RESULTS_SUCCESS: 'aramex_order_tracking_results_success',
  ARAMEX_ORDER_TRACKING_RESULTS_FAIL: 'aramex_order_tracking_results_fail',
};


