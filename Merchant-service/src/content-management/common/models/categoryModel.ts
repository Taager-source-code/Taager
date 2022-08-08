import mongoose from 'mongoose';

export interface Category {
  name: string;
  text: string;
  icon?: string;
  sorting: number;
  featured?: boolean;
  country: string;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}


