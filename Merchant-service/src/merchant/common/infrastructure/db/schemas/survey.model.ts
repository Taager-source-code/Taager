import mongoose from 'mongoose';

import AutoIncrement from 'mongoose-sequence';
import { SurveyModel } from '../models/surveyModel';

const autoIncrement = new AutoIncrement(mongoose);

const surveySchema = new mongoose.Schema<SurveyModel>(
  {
    surveyId: {
      type: Number,
      required: false,
      unique: true,
    },
    question: {
      type: String,
      required: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    isEnabled: {
      type: Boolean,
      required: true,
      default: false,
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

surveySchema.plugin(autoIncrement, {
  inc_field: 'surveyId',
  start_seq: 1,
  inc_amount: 1,
});

export default mongoose.model<SurveyModel>('survey', surveySchema);


