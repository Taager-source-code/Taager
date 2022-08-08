import mongoose from 'mongoose';

export type FeedbackModel = {
  Name: string;
  phoneNum: string;
  feedbackMessage: string;
  feedbackEmail: string;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


