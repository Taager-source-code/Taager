import joi from 'joi';
import { OK, NOT_FOUND, UNPROCESSABLE_ENTITY } from 'http-status';
import * as surveyService from '../../../queries/application/usecases/survey/survey.service';
import * as surveyAnswerService from '../../application/usecases/survey-answer/surveyAnswer.service';

const mapSurveyStatus = surveyStatus => {
  switch (surveyStatus) {
    case surveyAnswerService.surveyAnswersStatus.NO_SURVEY_ANSWER_FOUND:
      return NOT_FOUND;
    case surveyAnswerService.surveyAnswersStatus.SURVEY_SKIPPED_SUCCESSFULLY:
    case surveyAnswerService.surveyAnswersStatus.SURVEY_IS_ALREADY_SKIPPED:
    case surveyAnswerService.surveyAnswersStatus.SURVEY_IS_ALREADY_ANSWERED:
    case surveyAnswerService.surveyAnswersStatus.SURVEY_IS_DISABLED:
    case surveyAnswerService.surveyAnswersStatus.SURVEY_ANSWERED_SUCCESSFULLY:
      return OK;
    default:
      return OK;
  }
};
export const viewSurvey = async (req, res) => {
  const { _id: userId } = req.decodedToken.user;
  const survey = await surveyService.viewSurvey(userId);
  return res.status(OK).json(survey);
};
export const skipSurvey = async (req, res) => {
  let response = await surveyAnswerService.skipSurvey(req.params);
  if (response == null) response = { status: '500', result: 'Something went wrong!' };
  return res.status(mapSurveyStatus(response.status)).json({ msg: response.result });
};
export const answerSurvey = async (req, res) => {
  const schema = joi.object({
    answer: joi.boolean().required(),
    message: joi
      .string()
      .optional()
      .allow('', null),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  let response = await surveyAnswerService.answerSurvey(body, req.params);
  if (response == null) response = { status: '500', result: 'Something went wrong!' };
  return res.status(mapSurveyStatus(response.status)).json({ msg: response.result });
};


