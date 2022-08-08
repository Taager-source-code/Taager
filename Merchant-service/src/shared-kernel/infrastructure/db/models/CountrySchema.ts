import mongoose, { SchemaDefinition, SchemaOptions } from 'mongoose';
import { Country } from './Country';

const schema: SchemaDefinition<Country> = {
  countryIsoCode3: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  countryIsoCode2: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  countryIsoNumber: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  currencyIsoCode: {
    type: String,
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

export = mongoose.model<Country>('Country', CountrySchema);


