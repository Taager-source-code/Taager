import mongoose from 'mongoose';
import { QuestionnaireAnswerModel } from '../models/QuestionnaireAnswerModel';

const givenAnswerSchema = {
  questionId: {
    type: String,
    required: true,
  },
  answerIds: [{ type: String }],
  score: {
    type: Number,
    required: true,
  },
  scoreCap: {
    type: Number,
    required: true,
  },
};

const questionnaireAnswerSchema = new mongoose.Schema<QuestionnaireAnswerModel>(
  {
    questionnaireName: {
      type: String,
      required: true,
      index: true,
    },
    taagerId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['passed', 'failed', 'declined'],
      required: true,
      trim: true,
    },
    totalScore: {
      type: Number,
      required: false,
    },
    answers: {
      type: [givenAnswerSchema],
      required: false,
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

questionnaireAnswerSchema.index({ questionnaireName: 1, taagerId: 1 }, { unique: true });

export default mongoose.model<QuestionnaireAnswerModel>('QuestionnaireAnswer', questionnaireAnswerSchema);


