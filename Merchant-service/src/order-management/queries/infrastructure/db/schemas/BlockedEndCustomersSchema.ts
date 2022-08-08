import mongoose from 'mongoose';
import { BlockedEndCustomersDbo } from '../../../../commands/infrastructure/db/models/BlockedEndCustomersDbo';

const blockedEndCustomersSchema = new mongoose.Schema<BlockedEndCustomersDbo>(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true,
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

export default mongoose.model<BlockedEndCustomersDbo>('blockedEndCustomer', blockedEndCustomersSchema);


