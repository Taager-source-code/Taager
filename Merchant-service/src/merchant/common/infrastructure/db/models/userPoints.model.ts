import mongoose from 'mongoose';
import { UserPointModel } from '../models/userPoints';

const userPointsSchema = new mongoose.Schema<UserPointModel>(
  {
    pointsCount: {
      type: Number,
      required: true,
    },
    dateNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      default: 'active',
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

export default mongoose.model<UserPointModel>('UserPoint', userPointsSchema);


