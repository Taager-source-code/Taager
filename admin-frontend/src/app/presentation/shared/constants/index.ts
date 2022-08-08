import { environment } from "src/environments/environment";
export const ORDER_SOURCE_OPTIONS = [
  { id: 1, label: "Taager Website", value: "Cart" },
  { id: 2, label: "Woocommerce", value: "WooCommerce_cart" },
  { id: 3, label: "External Integration", value: "integration" },
];
export const TAAGER_RECOMMENDATIONS_GROUP_ID = 1;
export const API_URLS = {
  FEATURED_PRODUCTS_GROUP_URL: (id) =>
    `${environment.BACKEND_URL}api/featuredProductsGroup/${id}`,
  VIEW_PRODUDCTS_URL: `${environment.BACKEND_URL}api/product/viewProducts`,
  /* Order Issues Service URLs */
  ADD_CHILD_ORDER: `${environment.BACKEND_URL}api/child-order/direct`,
  ADD_ISSUE_ATTACHMENT_URL: ``,
  /*Variants urls*/
  CREATE_VARIANT_GROUP: `${environment.BACKEND_URL}api/variantGroup`,
  GET_VARIANT_GROUP: (id) => `${environment.BACKEND_URL}api/variantGroup/${id}`,
  UPDATE_VARIANT_GROUP: (id) =>
    `${environment.BACKEND_URL}api/variantGroup/${id}`,
  LIST_VARIANT_GROUPS: `${environment.BACKEND_URL}api/variantGroup/list`,
  /* Warehouse URLs */
  GENERATE_PICK_LIST_URL: `${environment.BACKEND_URL}api/warehouse/orders`,
  /** Countries List multi-tenancy */
  COUNTRIES_LIST_URL: `${environment.BACKEND_URL}api/countries`,
};
export const ORDER_ISSUE_TYPE = {
  REFUND: { name: "Refund", id: 1 },
  REPLACEMENT: { name: "Replacement", id: 2 },
  COMPLETION: { name: "Completion", id: 3 },
};
export const ORDER_SHIPMENT_CREATED_STATUS = "created";
export const ORDER_SHIPMENT_REVERT = "revert";
export const ORDER_SHIPMENT_SHIPPED_OUT_STATUS = "shipped_out";
export const ORDER_SHIPMENT_RETURNED = "returned";
export const ORDER_SHIPMENT_DELIVERED = "delivered";
export const ORDER_SHIPMENT_CANCELLED = "warehouse_cancelled";
export const ORDER_SHIPMENT_RETURN_IN_PROGRESS = "return_in_progress";
export const ORDER_SHIPMENT_RETURN_VERIFIED = "return_verified";
export const ORDER_SHIPMENT_STATUS_LIST = [
  { name: "Shipment Created", value: ORDER_SHIPMENT_CREATED_STATUS },
  { name: "Revert", value: ORDER_SHIPMENT_REVERT },
  { name: "Warehouse Cancelled", value: ORDER_SHIPMENT_CANCELLED },
  { name: "Shipped Out", value: ORDER_SHIPMENT_SHIPPED_OUT_STATUS },
  { name: "Return In Progress", value: ORDER_SHIPMENT_RETURN_IN_PROGRESS },
  { name: "Returned", value: ORDER_SHIPMENT_RETURNED },
  { name: "Return Verified", value: ORDER_SHIPMENT_RETURN_VERIFIED },
  { name: "Delivered", value: ORDER_SHIPMENT_DELIVERED },
];
export const exportCreatedFields = ["orderId", "trackingNumber"];
export const exportUpdatedFields = ["trackingNumber"];
export const exportDeliveredFields = ["trackingNumber", "updatedAt"];
export const exportCancelledFields = ["trackingNumber", "reason"];
export const LOCALSTORAGE_USERNAME_KEY = "userName";
