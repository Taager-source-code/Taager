import mongoose from 'mongoose';
import { ComplainModel } from '../models/complainSuggestion';

const complainSchema = new mongoose.Schema<ComplainModel>(
  {
    type: {
      type: String,
      required: true,
      enum: ['complain', 'suggestion'],
      default: 'complain',
    },
    complainReason: {
      type: Number,
      required: false,
      default: null,
    },
    suggestionSection: {
      type: Number,
      required: false,
      default: null,
    },
    details: {
      type: String,
      required: true,
    },
    TagerID: {
      type: Number,
      required: false,
      default: null,
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

export default mongoose.model<ComplainModel>('Complain', complainSchema);


