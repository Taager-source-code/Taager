import { getEnabledSurvey, getSurveyAnswer } from '../surveys.service';

function showSurvey(surveyAnswer) {
  return !surveyAnswer.isSkipped && !surveyAnswer.isAnswered;
}

export const viewSurvey = async userId => {
  const surveyAnswer = await getSurveyAnswer({ userId });

  if (surveyAnswer) {
    if (showSurvey(surveyAnswer)) {
      const survey = await getEnabledSurvey(surveyAnswer.surveyId);

      if (survey) {
        return { ...survey, surveyAnswer };
      }
    }
  }

  return {};
};


