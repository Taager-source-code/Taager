import mongoose from 'mongoose';

interface IncentiveProgram {
  name?: string;
  default: boolean;
  active: boolean;
  target: number;
  milestones: Milestone[];
}

interface Milestone {
  targetPercentage: number;
  rewardValuePerOrder: number;
}

const IncentiveProgramSchema = new mongoose.Schema<IncentiveProgram>(
  {
    name: {
      type: String,
      required: false,
    },
    default: {
      type: Boolean,
      required: true,
      default: false,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    target: {
      type: Number,
      required: true,
    },
    milestones: [
      {
        targetPercentage: {
          type: Number,
          required: true,
        },
        rewardValuePerOrder: {
          type: Number,
          required: true,
        },
      },
    ],
    incentiveProgramType: {
      type: String,
      trim: true,
      enum: ['limited', 'unlimited'],
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

export default mongoose.model<IncentiveProgram>('IncentiveProgram', IncentiveProgramSchema);


