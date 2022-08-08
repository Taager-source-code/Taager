import mongoose, { Connection } from 'mongoose';

export const secondaryConnection: Connection = mongoose.createConnection();


