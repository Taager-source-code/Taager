import SurveyRepository from '../../infrastructure/repositories/survey.repository';

const surveyRepositoryInstance = new SurveyRepository();

import SurveyAnswerRepository from '../../infrastructure/repositories/surveyAnswer.repository';

const surveyAnswerRepositoryInstance = new SurveyAnswerRepository();

const getSurvey = async query => {
  const survey = await surveyRepositoryInstance.getSurvey({
    query,
  });
  if (survey) {
    return survey[0];
  }
  return null;
};

export async function getEnabledSurvey(surveyId) {
  return getSurvey({ isEnabled: true, _id: surveyId });
}

export const getSurveyAnswer = async query => {
  const surveyAnswer = await surveyAnswerRepositoryInstance.getSurveyAnswer({
    query,
  });
  if (surveyAnswer.length) {
    return surveyAnswer[0];
  }
  return null;
};


