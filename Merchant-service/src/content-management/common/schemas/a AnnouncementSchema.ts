import mongoose, { SchemaDefinition, SchemaOptions } from 'mongoose';
import { Announcement } from '../models/Announcement';

const schema: SchemaDefinition<Announcement> = {
  img: {
    type: String,
    required: true,
    trim: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
  link: {
    type: String,
    required: false,
    trim: true,
  },
  country: {
    type: String,
    default: 'EGY',
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
const AnnouncementSchema = new mongoose.Schema(schema, options);

export = mongoose.model<Announcement>('Announcement', AnnouncementSchema);


