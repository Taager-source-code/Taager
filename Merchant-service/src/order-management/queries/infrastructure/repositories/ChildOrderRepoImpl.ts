import { ChildOrderRepo } from '../../application/contracts/ChildOrderRepo';
import { GetChildOrdersRequest } from '../../application/models/child-orders/GetChildOrdersRequest';
import ChildOrderDao from '../db/access/ChildOrderDao';
import OrderDao from '../db/access/OrderDao';
import { ChildOrdersResponse } from '../../application/models/child-orders/ChildOrdersResponse';
import { Service } from 'typedi';
import { SearchChildOrdersRequest } from '../../application/models/child-orders/SearchChildOrdersRequest';
import { AfterSaleOrderModel } from '../db/models/child-orders/AfterSaleOrderModel';
import { ParentOrderModel } from '../../application/models/child-orders/ParentOrderModel';

@Service({ global: true })
export default class ChildOrderRepoImpl implements ChildOrderRepo {
  private childOrderDao: ChildOrderDao;
  private orderDao: OrderDao;

  constructor(childOrderDao: ChildOrderDao, orderDao: OrderDao) {
    this.childOrderDao = childOrderDao;
    this.orderDao = orderDao;
  }

  async getChildOrders(getChildOrdersRequest: GetChildOrdersRequest): Promise<ChildOrdersResponse> {
    const childOrdersResponse = await this.childOrderDao.findPaginatedAndSortedDate(getChildOrdersRequest);

    const endflag = ChildOrderRepoImpl.calculateEndFlag(getChildOrdersRequest, childOrdersResponse);

    return {
      childOrders: await this.reconstructChildOrderDetails(childOrdersResponse.childOrders),
      counted: childOrdersResponse.childOrderCount,
      endflag: endflag,
    } as ChildOrdersResponse;
  }

  async searchInChildOrders(searchInChildOrdersRequest: SearchChildOrdersRequest): Promise<ChildOrdersResponse> {
    const childOrdersResponse = await this.childOrderDao.findPaginatedForTaager(searchInChildOrdersRequest);

    const endflag = ChildOrderRepoImpl.calculateEndFlag(searchInChildOrdersRequest, childOrdersResponse);

    return {
      childOrders: await this.reconstructChildOrderDetails(childOrdersResponse.childOrders),
      counted: childOrdersResponse.childOrderCount,
      endflag: endflag,
    } as ChildOrdersResponse;
  }

  private static calculateEndFlag(request: { pageSize: number; page: number }, response: { childOrderCount: number }) {
    return Math.ceil(response.childOrderCount / request.pageSize) === request.page;
  }

  private async reconstructChildOrderDetails(childOrders: AfterSaleOrderModel[]) {
    const parentOrders = await this.orderDao.findByIds(childOrders.map(
      childOrder => childOrder.parentOrderId,
    ) as string[]);

    const orderIdParentMap = new Map<string, ParentOrderModel>(
      parentOrders.map(parentOrder => [
        parentOrder.orderID as string,
        {
          pOrderId: parentOrder.orderID as string,
          pOrderObjectId: parentOrder._id as string,
          notes: parentOrder.notes as string,
          OrderPhoneNum: parentOrder.OrderPhoneNum,
        },
      ]),
    );

    return childOrders.map(childOrder => {
      return {
        ...orderIdParentMap.get(childOrder.parentOrderId as string),
        ...childOrder,
      };
    });
  }
}


