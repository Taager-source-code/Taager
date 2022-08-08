import OrderIssues from '../../../common/infrastructure/db/schemas/orderIssues.model';

export const addOrderIssue = body => OrderIssues.create(body);
export const findAllOrderIssues = (query, page = 0, pageSize = 100, lean = true) =>
  OrderIssues.find(query)
    .limit(pageSize)
    .skip(pageSize * page)
    .lean(lean)
    .exec();

export const findOrderIssueByIdAndUpdate = ({ id, update, options, lean = true }) =>
  OrderIssues.findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();


