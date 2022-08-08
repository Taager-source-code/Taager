import { Service } from 'typedi';
import joi from 'joi';
import { CONFLICT, NOT_FOUND, OK } from 'http-status';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import SubmitQuestionnaireAnswer from '../../application/usecases/SubmitQuestionnaireAnswer';
import SubmitQuestionnaireAnswerDtoConverter from './converters/SubmitQuestionnaireAnswerDtoConverter';
import { QuestionnaireNotFoundError } from '../../../common/application/exceptions/QuestionnaireNotFoundError';
import { QuestionnaireNotAvailableError } from '../../../common/application/exceptions/QuestionnaireNotAvailableError';
import { NonExistentAnswerOptionError } from '../../domain/exceptions/NonExistentAnswerOptionError';
import { UnansweredQuestionError } from '../../domain/exceptions/UnansweredQuestionError';

@Service({ global: true })
export default class SubmitQuestionnaireAnswerController extends HttpProcessor {
  private submitQuestionnaireAnswer: SubmitQuestionnaireAnswer;

  constructor(submitQuestionnaireAnswer: SubmitQuestionnaireAnswer) {
    super();
    this.submitQuestionnaireAnswer = submitQuestionnaireAnswer;
  }

  async execute(req, joiValue): Promise<HttpSuccess | HttpError> {
    const taagerId = req.decodedToken.user.TagerID;
    const questionnaireName = req.params.questionnaireName;
    const submitRequest = SubmitQuestionnaireAnswerDtoConverter.toModel(joiValue, taagerId, questionnaireName);
    try {
      const status = await this.submitQuestionnaireAnswer.execute(submitRequest);
      return { status: OK, data: { status: status.toLowerCase() } };
    } catch (error) {
      return this.handleError(error, questionnaireName, taagerId);
    }
  }

  schema = joi
    .object({
      answers: joi
        .array()
        .required()
        .min(1)
        .items(
          joi.object({
            questionId: joi
              .string()
              .trim()
              .required(),
            answerIds: joi
              .array()
              .required()
              .items(joi.string()),
          }),
        ),
    })
    .options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any, questionnaireName: string, taagerId: string): HttpError {
    if (error instanceof QuestionnaireNotFoundError) {
      Logger.info(`Questionnaire not found: ${error.stack}`, { domain: 'engagement' });

      return {
        status: NOT_FOUND,
        errorCode: 'questionnaires-0001',
        description: 'Questionnaire not found',
        message: `Questionnaire with name=${questionnaireName} not found`,
      };
    } else if (error instanceof QuestionnaireNotAvailableError) {
      Logger.info(`Questionnaire not available: ${error.stack}`, { domain: 'engagement' });

      return {
        status: NOT_FOUND,
        errorCode: 'questionnaires-0002',
        description: 'Questionnaire not available',
        message: `Questionnaire with name=${questionnaireName} not available to taagerId=${taagerId}`,
      };
    } else if (error instanceof NonExistentAnswerOptionError || error instanceof UnansweredQuestionError) {
      Logger.info(`Submit data malformed: ${error.stack}`, { domain: 'engagement' });

      return {
        status: CONFLICT,
        errorCode: 'questionnaires-0003',
        description: 'Questionnaire answers not submittable',
        message: `Answers submitted for the questionnaire is not well formed: ${error.message}`,
      };
    } else {
      Logger.error(`Undefined error: ${(error as Error).stack}`, { domain: 'engagement' });

      throw error;
    }
  }
}


