import paymentRequest from '../../../common/infrastructure/db/schemas/paymentRequest.model';

export const getAllRequests = (query, page = 0, pageSize = 100, lean = true) =>
  paymentRequest
    .find(query)
    .populate('userId', '_id lastName email TagerID createdAt username userLevel')
    .limit(pageSize)
    .skip(pageSize * page)
    .lean(lean)
    .sort({ createdAt: -1 })
    .exec();
export const addPaymentRequest = (body, session) => {
  return new paymentRequest(body).save({ session });
};
export const findPaymentRequests = query =>
  paymentRequest
    .find(query)
    .sort({ createdAt: -1 })
    .exec();

export const countRequests = query => paymentRequest.countDocuments(query).exec();

	
