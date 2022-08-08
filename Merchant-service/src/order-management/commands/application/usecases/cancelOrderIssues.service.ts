import { findOrderByIdAndUpdate } from '../../../queries/application/usecases/order.service';

import { createOrderActivity } from './orderActivity.service';
import { findOrderIssueByIdAndUpdate } from './orderIssues.service';

async function updateOrderIssue(objectId, status) {
  await findOrderIssueByIdAndUpdate({
    id: objectId,
    update: {
      $set: {
        status,
      },
    },
    options: {
      new: false,
    },
    lean: false,
  });
}

function createActivityObject(orderObjectId, orderId, orderActivityStatus) {
  return {
    orderStatus: orderActivityStatus,
    orderObjectId,
    orderID: orderId,
  };
}

async function createActivity(orderObjectId, orderId, orderActivityStatus) {
  const createActivityObj = createActivityObject(orderObjectId, orderId, orderActivityStatus);

  await createOrderActivity(createActivityObj);
}

async function updateOrder(orderObjectId) {
  await findOrderByIdAndUpdate({
    id: orderObjectId,
    update: {
      $set: {
        hasIssue: false,
      },
    },
    options: {
      new: false,
    },
    lean: false,
  });
}

const issueTypes = Object.freeze({
  ORDER_REPLACEMENT_REQUEST: 'order_replacement_request',
  ORDER_REFUND_REQUEST: 'order_refund_request',
  ORDER_ADDITION_REQUEST: 'order_addition_request',
});

const mapIssueNumberToIssueType = issueNumber => {
  switch (issueNumber) {
    case 1:
      return issueTypes.ORDER_REFUND_REQUEST;
    case 2:
      return issueTypes.ORDER_REPLACEMENT_REQUEST;
    case 3:
      return issueTypes.ORDER_ADDITION_REQUEST;
    default:
      return '';
  }
};

const getOrderIssueStatus = IssueType => {
  return `${IssueType}_merchant_cancelled`;
};

export const cancelOrderIssue = async order => {
  const { objectId, status, issueType, orderObjectId, orderId } = order;

  await updateOrder(orderObjectId);

  const issueTypeStatus = mapIssueNumberToIssueType(issueType);

  const orderActivityStatus = getOrderIssueStatus(issueTypeStatus);

  await createActivity(orderObjectId, orderId, orderActivityStatus);

  await updateOrderIssue(objectId, status);
};


