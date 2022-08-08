import joi from 'joi';
import { UNAUTHORIZED, NOT_FOUND, UNPROCESSABLE_ENTITY, OK, CREATED } from 'http-status';
import { createFeedback, findAllFeedback } from '../../application/usecases/feedback.service';

export const CreateFeedback = async (req, res) => {
  const schema = joi
    .object({
      Name: joi
        .string()
        .trim()
        .required(),
      phoneNum: joi.string().required(),
      feedbackMessage: joi
        .string()
        .required()
        .trim(),
      feedbackEmail: joi
        .string()
        .required()
        .trim()
        .email(),
    })
    .options({
      stripUnknown: true,
    });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }

  const feedBack = await createFeedback(req.body);
  if (feedBack) {
    return res.status(CREATED).json({ msg: 'Created' });
  }
  return res.status(UNPROCESSABLE_ENTITY).json({ msg: 'Unable to send feedback!' });
};
export const viewFeedback = async (req, res) => {
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const feedback = await findAllFeedback();
  if (feedback) {
    return res.status(OK).json({
      msg: 'Feedback found!',
      data: feedback,
    });
  }
  return res.status(NOT_FOUND).json({
    msg: "Feedback can't be retrieved",
  });
};


