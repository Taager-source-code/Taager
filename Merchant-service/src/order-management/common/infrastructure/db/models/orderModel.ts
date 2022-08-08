/* tslint:disable */
/* eslint-disable */

import mongoose from "mongoose";
import { OrderConversation } from "./orderConversation";
import { UserModel } from "../../../../../merchant/common/infrastructure/db/models/userModel";
import { ProductModel } from "../../../../../content-management/queries/infrastructure/db/models/ProductModel";
import OrderLine from "../../../../commands/domain/OrderLine";

export type OrderedProductItem = {
  price?: number;
  quantity?: number;
  productObjectId?: ProductModel["_id"] | ProductModel;
  productID?: string;
  returnQuantity?: number;
  replacedQuantity?: number;
  profit?: number;
  _id: mongoose.Types.ObjectId;
};


export type OrderModel = {
  receiverName: string;
  province: string;
  district?: string;
  streetName: string;
  country: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  detailedAddress?: any;
  orderedProducts: OrderedProductItem[] | mongoose.Types.ObjectId[];
  phoneNumber: string;
  phoneNumber2?: string;
  productPrices: number[];
  productQuantities: number[];
  products: (ProductModel["_id"] | ProductModel)[];
  duplicateOrders: (OrderModel["_id"] | OrderModel)[];
  productIds: string[];
  assignedAdmin?: UserModel["_id"] | UserModel;
  sellerId?: UserModel["_id"] | UserModel;
  orderedBy?: UserModel["_id"] | UserModel;
  orderedByName: string;
  sellerName: string;
  totalCost?: number;
  status?: string;
  rating?: number;
  complain?: string;
  pid: string;
  productId?: ProductModel["_id"] | ProductModel;
  orderNum?: number;
  orderID?: string;
  TagerID: number;
  orderProfit: number;
  message: string;
  shippingNotes?: string;
  notes?: string;
  OrderPhoneNum: string;
  trackingId?: string;
  deliveryNotes?: string;
  isOrderVerified?: boolean;
  orderReceivedBy?: string;
  deliveryDate?: Date;
  replacementDate?: Date;
  confirmationDate?: Date;
  ConversationId?: OrderConversation["_id"] | OrderConversation;
  isUserRead?: boolean;
  isAdminRead?: boolean;
  cashOnDelivery?: number;
  pickupDate?: Date;
  deliverySuspendedReason?: string;
  productReturnQuantities: number[];
  productReplacedQuantities: number[];
  productProfits: number[];
  shippingInfo?: any;
  failedAttemptsCount?: number;
  failedAttemptNote?: string;
  mergeableOrders: (OrderModel["_id"] | OrderModel)[];
  hasIssue?: boolean;
  shipmentStatus?: string;
  zone: {
    name?: string;
    status?: string;
  };
  orderSource?: any;
  suspendedReason?: number;
  delayedReason?: number;
  customerRejectedReason?: number;
  readyToPickup?: boolean;
  _id: mongoose.Types.ObjectId | string;
  orderLines?: OrderLine[];
  updatedAt?: Date;
  createdAt?: Date;
};

