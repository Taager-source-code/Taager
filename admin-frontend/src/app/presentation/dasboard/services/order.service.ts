import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}
  orderNow(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/makeOrderDirect`;
    return this.http.post(url, data);
  }
  orderCart(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/makeOrderByCart`;
    return this.http.post(url, data);
  }
  getProvinces(country): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/getProvinces`;
    return this.http.get(url, { params: { country: country } });
  }
  getPendingRequests(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/request/viewPendingRequests`;
    return this.http.get(url);
  }
  getInProgressRequests(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/request/viewInProgRequests`;
    return this.http.get(url);
  }
  rateOrder(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/rateOrder`;
    return this.http.patch(url, order);
  }
  getOrderStatus(
    pageSize,
    pageNum,
    filter,
    isVerified,
    assignedOrders,
    country?
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewOrdersWithStatus`;
    const bodyData = {
      pageSize,
      page: pageNum,
      filterObj: filter,
      status: isVerified,
      assignedOrders: assignedOrders,
      country: country,
    };
    return this.http.post(url, bodyData);
  }
  getOrderActivityWithStatus(
    filter,
    pageSize = 10,
    pageNum = 1
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getOrderActivityWithStatus`;
    const bodyData = { pageSize, page: pageNum, filterObj: filter };
    return this.http.post(url, bodyData);
  }
  getActiveBostaOrders(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getActiveBostaOrders`;
    return this.http.get(url);
  }
  getOrderStatusExtract(filter): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getAllOrdersWithStatus`;
    const bodyData = { filterObj: filter };
    return this.http.post(url, bodyData);
  }
  getOrdersByTaagerId(filter): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getOrdersByTaagerId`;
    const bodyData = { filterObj: filter };
    return this.http.post(url, bodyData);
  }
  getOrderById(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewOrder/${id}`;
    return this.http.get(url);
  }
  getChildOrderById(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order/viewChildOrder/${id}`;
    return this.http.get(url);
  }
  getAllOrders(pageSize, pageNum, filterObj, country): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewAllOrders`;
    const bodyParam = {
      pageSize,
      page: pageNum,
      filter: filterObj,
      country: country,
    };
    return this.http.post(url, bodyParam);
  }
  viewOrdersWithIDs(orderIdsArray): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewOrdersWithIDs`;
    const bodyParam = { orderIdsArray: orderIdsArray };
    return this.http.post(url, bodyParam);
  }
  viewChildOrdersWithIDs(orderIdsArray): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order/viewOrdersWithIDs`;
    const bodyParam = { orderIdsArray: orderIdsArray };
    return this.http.post(url, bodyParam);
  }
  getAllOrdersWithMessages(
    pageSize,
    pageNum,
    filterObj,
    country
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewAllOrdersWithMessages`;
    const bodyParam = {
      pageSize,
      page: pageNum,
      filter: filterObj,
      country: country,
    };
    return this.http.post(url, bodyParam);
  }
  getAllOrdersExtract(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewAllOrdersExtract`;
    return this.http.get(url);
  }
  getReferralsOrders(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getReferralsOrders`;
    return this.http.get(url);
  }
  getBestsellers(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/bestsellers`;
    return this.http.get(url);
  }
  getPendingOrders(pageSize, pageNum): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewPendingOrders`;
    const bodyParam = { pageSize, page: pageNum };
    return this.http.get(url, { params: bodyParam });
  }
  getInProgressOrders(pageSize, pageNum): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewinProgOrders`;
    const bodyParam = { pageSize, page: pageNum };
    return this.http.get(url, { params: bodyParam });
  }
  updateOrder(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateOrderStatus`;
    return this.http.patch(url, order);
  }
  updateRequest(request): Observable<any> {
    const url = `${environment.BACKEND_URL}api/request/updateRequests`;
    return this.http.patch(url, request);
  }
  revertOrderStatus(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/revertOrderStatus`;
    return this.http.patch(url, order);
  }
  updateOrderStatusCustom(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateOrderStatusCustom`;
    return this.http.patch(url, order);
  }
  updateChildOrderStatusCustom(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order`;
    return this.http.patch(url, order);
  }
  verifyChildOrder(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order/completeTransfer`;
    return this.http.patch(url, order);
  }
  itemReceiveChildOrder(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order/inventoryReceivedItem`;
    return this.http.patch(url, order);
  }
  assignOrdersToAdmin(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/assignOrdersToAdmin`;
    return this.http.patch(url, order);
  }
  updateOrderProfit(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateOrderProfit`;
    return this.http.patch(url, order);
  }
  cancelOrder(orders): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/cancelOrder`;
    return this.http.patch(url, orders);
  }
  updateOrderVerifiedStatus(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateOrderVerifiedStatus`;
    return this.http.patch(url, order);
  }
  unVerifyOrderStatus(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/unVerifyOrderStatus`;
    return this.http.patch(url, order);
  }
  addOrderMessage(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/addOrderMessage`;
    return this.http.post(url, data);
  }
  getOrderMessages(obj): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getOrderMessages`;
    const bodyParam = obj;
    return this.http.get(url, { params: bodyParam });
  }
  addOrderAdminNote(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/addOrderAdminNote`;
    return this.http.post(url, data);
  }
  getOrderAdminNotes(obj): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getOrderAdminNotes`;
    const bodyParam = obj;
    return this.http.get(url, { params: bodyParam });
  }
  getAllOrdersWithUnreadMessages(
    pageSize,
    pageNum,
    filterObj,
    country?
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getAllOrdersWithUnreadMessages`;
    const bodyParam = {
      pageSize,
      page: pageNum,
      filter: filterObj,
      country: country,
    };
    return this.http.post(url, bodyParam);
  }
  markMessageAsRead(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/markMessageAsRead`;
    return this.http.post(url, data);
  }
  viewAllOrdersWithMessagesUser(
    pageSize = 100,
    pageNum = 1,
    country
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewAllOrdersWithMessagesUser`;
    const bodyData = { pageSize, page: pageNum, country: country };
    return this.http.post(url, bodyData);
  }
  viewOrdersWithUnreadMessages(pageSize = 10, pageNum = 1): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewOrdersWithUnreadMessages`;
    const bodyData = { pageSize, page: pageNum };
    return this.http.post(url, bodyData);
  }
  sendOrderChangeNotifications(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/sendOrderChangeNotifications`;
    return this.http.post(url, order);
  }
  updateOrderProductPrices(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateOrderProductPrices`;
    return this.http.patch(url, order);
  }
  updateUserWallet(order): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateUserWallet`;
    return this.http.patch(url, order);
  }
  migrateLoyaltyPrograms(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/migrateLoyaltyPrograms`;
    return this.http.get(url);
  }
  failAttempt(failAttempt): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/failAttempt`;
    return this.http.post(url, failAttempt);
  }
  mergeOrders(mergeOrderArrays): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/mergeOrders`;
    return this.http.post(url, mergeOrderArrays);
  }
  ViewOrderIssues(pageSize, pageNum, filter, country?): Observable<any> {
    const url = `${environment.BACKEND_URL}api/orderIssues/ViewOrderIssues`;
    const bodyData = {
      pageSize,
      page: pageNum,
      filterObj: filter,
      country: country,
    };
    return this.http.post(url, bodyData);
  }
  ViewChildOrders(
    pageSize,
    pageNum,
    country,
    { status, orderID, fromDate, toDate, zone, shippingCompanyStatus }
  ): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order?page=${pageNum}&pageSize=${pageSize}&country=${country}&status=${status}&orderID=${orderID}&fromDate=${fromDate}&toDate=${toDate}&zone=${zone}&shippingCompanyStatus=${shippingCompanyStatus}`;
    return this.http.get(url);
  }
  getShippingCompanyStatuses(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order/shipping-statuses`;
    return this.http.get(url);
  }
  ResolveOrderIssues(bodyData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/orderIssues/ResolveOrderIssues`;
    return this.http.post(url, bodyData);
  }
  getOrderIssue(bodyData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/orderIssues/getOrderIssue`;
    return this.http.post(url, bodyData);
  }
  getDeliveredBostaOrders(pageSize, pageNum, filter, country): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/getDeliveredBostaOrders`;
    const bodyData = {
      pageSize,
      page: pageNum,
      filterObj: filter,
      country: country,
    };
    return this.http.post(url, bodyData);
  }
  updateOrderShipmentStatus(body): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/updateOrderShipmentStatus`;
    return this.http.post(url, body);
  }
  createChildOrder(bodyData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order`;
    return this.http.post(url, bodyData);
  }
  createBostaLog(bodyData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/createBostaLog`;
    return this.http.post(url, bodyData);
  }
  addDeliveryTrackingToOdoo(bodyData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/addDeliveryTrackingToOdoo`;
    return this.http.post(url, bodyData);
  }
  getChildOrderStatusExtract(filter, country): Observable<any> {
    const url = `${environment.BACKEND_URL}api/child-order/getAllChildOrdersWithStatus`;
    const bodyData = { filterObj: filter, country };
    return this.http.post(url, bodyData);
  }
}
