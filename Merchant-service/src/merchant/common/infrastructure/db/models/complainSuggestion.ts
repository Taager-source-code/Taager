import mongoose from 'mongoose';

export type ComplainModel = {
  type: 'complain' | 'suggestion';
  complainReason?: number;
  suggestionSection?: number;
  details: string;
  TagerID?: number;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
};


