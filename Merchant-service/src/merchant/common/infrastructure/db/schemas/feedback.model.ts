import mongoose from 'mongoose';
import { FeedbackModel } from '../models/feedbackModel';

const feedbackSchema = new mongoose.Schema<FeedbackModel>(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNum: {
      type: String,
      required: true,
      trim: false,
    },
    feedbackMessage: {
      type: String,
      required: true,
    },
    feedbackEmail: {
      type: String,
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

export default mongoose.model<FeedbackModel>('Feedback', feedbackSchema);


