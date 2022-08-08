import mongoose from 'mongoose';
import { shipmentTrackingModel } from '../models/shipmentTrackingModel';

const shipmentTrackingSchema = new mongoose.Schema<shipmentTrackingModel>(
  {
    orderObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    orderID: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
    },
    shipmentStatus: {
      type: String,
      required: true,
    },
    updatedDate: {
      type: String,
      required: false,
    },
    reason: {
      type: String,
      required: false,
    },
    payload: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function(doc, ret) {
        return ret;
      },
    },
  },
);

export default mongoose.model<shipmentTrackingModel>('shipmentTracking', shipmentTrackingSchema);


