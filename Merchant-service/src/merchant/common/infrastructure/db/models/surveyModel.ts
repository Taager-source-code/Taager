import mongoose from 'mongoose';

export type SurveyModel = {
  surveyId?: number;
  question: string;
  name: string;
  isEnabled: boolean;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


