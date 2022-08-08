import mongoose from 'mongoose';
import { QuestionnaireModel } from '../models/QuestionnaireModel';

const textSchema = {
  en: {
    type: String,
    required: false,
  },
  ar: {
    type: String,
    required: true,
  },
};

const answerSchema = {
  id: {
    type: String,
    required: true,
  },
  iconUrl: {
    type: String,
    required: false,
  },
  text: {
    type: textSchema,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
};

const questionSchema = {
  id: {
    type: String,
    unique: true,
  },
  text: {
    type: textSchema,
    required: true,
  },
  iconUrl: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: true,
    trim: true,
  },
  maxAllowedAnswers: {
    type: Number,
    required: false,
    nullable: true,
  },
  scoreCap: {
    type: Number,
    required: false,
  },
  answers: {
    type: [answerSchema],
    required: true,
  },
};

const questionnaireSchema = new mongoose.Schema<QuestionnaireModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    passingScore: {
      type: Number,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        return ret;
      },
    },
  },
);

export default mongoose.model<QuestionnaireModel>('Questionnaire', questionnaireSchema);


