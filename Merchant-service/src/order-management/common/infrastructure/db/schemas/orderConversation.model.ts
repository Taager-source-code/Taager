import mongoose from 'mongoose';
import { OrderConversation } from '../models/orderConversation';

const orderConversationSchema = new mongoose.Schema<OrderConversation>(
  {
    orderObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
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

export default mongoose.model<OrderConversation>('OrderConversation', orderConversationSchema);


