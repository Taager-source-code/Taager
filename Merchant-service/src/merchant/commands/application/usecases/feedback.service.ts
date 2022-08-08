import Feedback from '../../../common/infrastructure/db/schemas/feedback.model';

export const createFeedback = body => Feedback.create(body);
export const findAllFeedback = () => Feedback.find().exec();


