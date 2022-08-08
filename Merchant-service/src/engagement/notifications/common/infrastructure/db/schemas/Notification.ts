import mongoose from 'mongoose';
import { Notification } from '../models/Notification';

const notificationSchema = new mongoose.Schema<Notification>(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    taagerId: {
      type: Number,
      required: false,
      default: null,
    },
    type: {
      type: String,
      enum: ['bulk', 'personal'],
      default: 'personal',
    },
    link: {
      type: String,
      required: false,
      default: '/',
    },
    country: {
      type: String,
      default: 'EGY',
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

export default mongoose.model<Notification>('Notification', notificationSchema);


