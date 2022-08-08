import { Service } from 'typedi';
import AfterSaleOrderSchema from '../schemas/child-orders/AfterSaleOrderSchema';
import { GetChildOrdersRequest } from '../../../application/models/child-orders/GetChildOrdersRequest';
import { AfterSaleOrderModel } from '../models/child-orders/AfterSaleOrderModel';
import { SearchChildOrdersRequest } from '../../../application/models/child-orders/SearchChildOrdersRequest';
import { AfterSaleOrderQueryFilter } from '../models/child-orders/AfterSaleOrderQueryFilter';

@Service({ global: true })
export default class ChildOrderDao {
  async findPaginatedAndSortedDate(
    filterObject: GetChildOrdersRequest,
  ): Promise<{ childOrders: AfterSaleOrderModel[]; childOrderCount: number }> {
    const query = this.generateQueryFilter(filterObject.queryOptions);
    const childOrders = await AfterSaleOrderSchema.find(query)
      .limit(filterObject.pageSize)
      .skip(filterObject.pageSize * (filterObject.page - 1))
      .sort({ createdAt: -1 })
      .lean(true)
      .exec();
    const childOrderCount = await this.count(query);
    return { childOrders, childOrderCount };
  }

  async findPaginatedForTaager(
    filterObject: SearchChildOrdersRequest,
  ): Promise<{ childOrders: AfterSaleOrderModel[]; childOrderCount: number }> {
    const query = this.generateSearchQueryForTaager(filterObject);
    const childOrders = await AfterSaleOrderSchema.find(query)
      .limit(filterObject.pageSize)
      .skip(filterObject.pageSize * (filterObject.page - 1))
      .lean(true)
      .exec();
    const childOrderCount = await this.count(query);
    return { childOrders, childOrderCount };
  }

  private count(query): Promise<number> {
    return AfterSaleOrderSchema.count(query).exec();
  }

  private generateQueryFilter(queryParams: AfterSaleOrderQueryFilter) {
    const options: any = {};
    if (queryParams.country) {
      options.country = queryParams.country;
    }
    if (queryParams.status) {
      options.status = queryParams.status;
    }
    if (queryParams.orderID) {
      options.orderID = queryParams.orderID;
    }
    if (queryParams.parentOrderId) {
      options.parentOrderId = queryParams.parentOrderId;
    }
    if (queryParams.taagerID) {
      options.$and = [{ parentOrderId: { $regex: `^${queryParams.taagerID}/` } }];
    }
    if (queryParams.fromDate) {
      options.createdAt = { $gte: queryParams.fromDate };
    }
    if (queryParams.toDate) {
      options.createdAt = { $lt: queryParams.toDate };
    }
    if (queryParams.toDate && queryParams.taagerID) {
      options.createdAt = {
        $gte: queryParams.fromDate,
        $lt: queryParams.toDate,
      };
    }
    return options;
  }

  private generateSearchQueryForTaager(queryParams: AfterSaleOrderQueryFilter) {
    const options: any = {
      parentOrderId: { $regex: `^${queryParams.taagerID}/` },
    };
    if (queryParams.filter) {
      options.$or = [
        { receiverName: queryParams.filter },
        { orderID: queryParams.filter },
        { phoneNumber: queryParams.filter },
        { phoneNumber2: queryParams.filter },
      ];
    }
    return options;
  }
}


