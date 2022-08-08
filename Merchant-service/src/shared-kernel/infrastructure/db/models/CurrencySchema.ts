import mongoose, { SchemaDefinition, SchemaOptions } from 'mongoose';
import { Currency } from './Currency';

const schema: SchemaDefinition<Currency> = {
  currencyIsoCode: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  currencySymbol: {
    type: String,
    required: true,
    trim: true,
  },
  currencyIsoNumber: {
    type: Number,
    unique: true,
    required: true,
    trim: true,
  },
};
const options: SchemaOptions = {
  timestamps: true,
  toObject: {
    transform: function(doc, ret) {
      return ret;
    },
  },
};
const CountrySchema = new mongoose.Schema(schema, options);

export = mongoose.model<Currency>('Currency', CountrySchema);


