import OrderActivity from '../../../common/infrastructure/db/schemas/orderActivity.model';

export const createOrderActivity = body => OrderActivity.create(body);
export const findAllOrderActivities = (query, page = 0, pageSize = 100, lean = true) =>
  OrderActivity.find(query)
    .populate('adminUserId')
    .limit(pageSize)
    .skip(pageSize * page)
    .lean(lean)
    .exec();

export const findAllOrderActivitiesUser = async query =>
  OrderActivity.aggregate([
    { $match: query },
    { $group: { _id: '$orderStatus', doc: { $last: '$$ROOT' } } },
    { $sort: { 'doc.createdAt': 1 } },
  ]);

export const countOrderActivity = query => OrderActivity.countDocuments(query).exec();
export const createMultipleOrderActivities = body => OrderActivity.insertMany(body);


