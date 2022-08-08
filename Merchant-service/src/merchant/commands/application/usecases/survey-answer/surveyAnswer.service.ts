import { isValidObjectId } from 'mongoose';
import SurveyAnswerRepository from '../../../../queries/infrastructure/repositories/surveyAnswer.repository';
import { getEnabledSurvey } from '../../../../queries/application/usecases/surveys.service';

const surveyAnswerRepositoryInstance = new SurveyAnswerRepository();

function isObjectIdValid(surveyAnswerObjectID) {
  return isValidObjectId(surveyAnswerObjectID);
}

async function getSurveyAnswerByObjectID(surveyAnswerObjectID) {
  return surveyAnswerRepositoryInstance.getSurveyAnswerByObjectID(surveyAnswerObjectID);
}

function isSkipped(surveyAnswerDoc) {
  return surveyAnswerDoc.isSkipped;
}

function isAnswered(surveyAnswerDoc) {
  return surveyAnswerDoc.isAnswered;
}

export const surveyAnswersStatus = Object.freeze({
  NO_SURVEY_ANSWER_FOUND: 'no_survey_answer_found',
  SURVEY_SKIPPED_SUCCESSFULLY: 'survey_skipped_successfully',
  SURVEY_IS_ALREADY_SKIPPED: 'survey_is_already_skipped',
  SURVEY_IS_ALREADY_ANSWERED: 'survey_is_already_answered',
  SURVEY_IS_DISABLED: 'survey_is_disabled',
  SURVEY_ANSWERED_SUCCESSFULLY: 'survey_answered_successfully',
});

const getAnswerUpdateQuery = survey => {
  const { message, answer, isAnswered } = survey;
  if (message) {
    return { message, answer, isAnswered, isSkipped: false };
  }
  return { answer, isAnswered, isSkipped: false };
};

const getSkipUpdateQuery = survey => {
  const { isSkipped } = survey;
  const updateQuery = {
    isSkipped: isSkipped,
  };
  updateQuery.isSkipped = isSkipped;
  return updateQuery;
};

async function updateSurveyAnswerByObjectID(objectID, surveyAnswerBody) {
  await surveyAnswerRepositoryInstance.updateSurveyAnswerByObjectID(objectID, surveyAnswerBody);
}

async function updateAnswer(surveyAnswerId, answerBody, onSkipping = true) {
  if (onSkipping) {
    const updateQuery = getSkipUpdateQuery(answerBody);
    await updateSurveyAnswerByObjectID(surveyAnswerId, updateQuery);
    return {
      result: 'Survey Skipped Successfully',
      status: surveyAnswersStatus.SURVEY_SKIPPED_SUCCESSFULLY,
    };
  }
  if (!onSkipping) {
    const updateQuery = getAnswerUpdateQuery(answerBody);
    await updateSurveyAnswerByObjectID(surveyAnswerId, updateQuery);
    return {
      result: 'Survey Answered Successfully',
      status: surveyAnswersStatus.SURVEY_ANSWERED_SUCCESSFULLY,
    };
  }
}

export const skipSurvey = async requestParams => {
  const surveyAnswerObjectID = requestParams._id;

  if (isObjectIdValid(surveyAnswerObjectID)) {
    const surveyAnswerDoc = await getSurveyAnswerByObjectID(surveyAnswerObjectID);

    if (surveyAnswerDoc) {
      if (isSkipped(surveyAnswerDoc)) {
        return {
          result: 'Survey is already skipped.',
          status: surveyAnswersStatus.SURVEY_IS_ALREADY_SKIPPED,
        };
      }

      if (isAnswered(surveyAnswerDoc)) {
        return {
          result: 'Survey is already answered and you can not skip.',
          status: surveyAnswersStatus.SURVEY_IS_ALREADY_ANSWERED,
        };
      }

      return updateAnswer(surveyAnswerDoc._id, { isSkipped: true }, true);
    }
    return {
      result: 'Survey Answer Not Found',
      status: surveyAnswersStatus.NO_SURVEY_ANSWER_FOUND,
    };
  }
  return {
    result: 'Please provide a valid ObjectId(_id)',
    status: surveyAnswersStatus.NO_SURVEY_ANSWER_FOUND,
  };
};

export const answerSurvey = async (surveyBody, requestParams) => {
  const surveyAnswerObjectID = requestParams._id;

  if (isObjectIdValid(surveyAnswerObjectID)) {
    const surveyAnswerDoc = await getSurveyAnswerByObjectID(surveyAnswerObjectID);

    if (surveyAnswerDoc) {
      const isSurveyEnabled = await getEnabledSurvey(surveyAnswerDoc.surveyId);
      if (!isSurveyEnabled) {
        return {
          result: 'Survey is disabled.',
          status: surveyAnswersStatus.SURVEY_IS_DISABLED,
        };
      }

      if (isAnswered(surveyAnswerDoc)) {
        return {
          result: 'Survey is already answered.',
          status: surveyAnswersStatus.SURVEY_IS_ALREADY_ANSWERED,
        };
      }

      if (isSkipped(surveyAnswerDoc)) {
        const answerBody = { ...surveyBody, isAnswered: true };
        return updateAnswer(surveyAnswerDoc._id, answerBody, false);
      }

      const answerBody = { ...surveyBody, isAnswered: true };
      return updateAnswer(surveyAnswerDoc._id, answerBody, false);
    }
    return {
      result: 'Survey Answer Not Found',
      status: surveyAnswersStatus.NO_SURVEY_ANSWER_FOUND,
    };
  }
  return {
    result: 'Please provide a valid ObjectId(_id)',
    status: surveyAnswersStatus.NO_SURVEY_ANSWER_FOUND,
  };
};


