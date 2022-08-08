import mongoose from 'mongoose';
import { UserModel } from './userModel';
import { SurveyModel } from './surveyModel';

export type surveyAnswer = {
  surveyId?: SurveyModel['_id'] | SurveyModel;
  userId?: UserModel['_id'] | UserModel;
  isAnswered?: boolean;
  isSkipped?: boolean;
  answer?: boolean;
  message?: string;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


