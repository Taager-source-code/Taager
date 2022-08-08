import mongoose from 'mongoose';

interface MerchantIncentiveProgram {
  tagerID: number;
  incentiveProgramID: string;
}

const MerchantIncentiveProgramSchema = new mongoose.Schema<MerchantIncentiveProgram>(
  {
    tagerID: {
      type: Number,
      required: false,
      unique: true,
      default: null,
    },
    incentiveProgramID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncentiveProgram',
      required: true,
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

export default mongoose.model<MerchantIncentiveProgram>('MerchantIncentiveProgram', MerchantIncentiveProgramSchema);


