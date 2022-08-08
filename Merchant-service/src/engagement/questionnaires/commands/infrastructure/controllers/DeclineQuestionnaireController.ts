import { Service } from 'typedi';
import joi from 'joi';
import { NOT_FOUND, OK } from 'http-status';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { QuestionnaireNotFoundError } from '../../../common/application/exceptions/QuestionnaireNotFoundError';
import { QuestionnaireNotAvailableError } from '../../../common/application/exceptions/QuestionnaireNotAvailableError';
import DeclineQuestionnaire from '../../application/usecases/DeclineQuestionnaire';
import QuestionnaireName from '../../domain/models/valueobjects/QuestionnaireName';
import TaagerId from '../../domain/models/valueobjects/TaagerId';
import { Request } from 'express';

@Service({ global: true })
export default class DeclineQuestionnaireController extends HttpProcessor {
  private declineQuestionnaire: DeclineQuestionnaire;

  constructor(declineQuestionnaire: DeclineQuestionnaire) {
    super();
    this.declineQuestionnaire = declineQuestionnaire;
  }

  async execute(req, joiValue): Promise<HttpSuccess | HttpError> {
    const taagerId = req.decodedToken.user.TagerID;
    const questionnaireName = joiValue.questionnaireName;
    try {
      await this.declineQuestionnaire.execute(new QuestionnaireName(questionnaireName), new TaagerId(taagerId));
      return { status: OK, data: {} };
    } catch (error) {
      return this.handleError(error, questionnaireName, taagerId);
    }
  }

  schema = joi
    .object({ questionnaireName: joi.string().required() })
    .options({ allowUnknown: true, stripUnknown: true });

  getValueToValidate(req: Request): any {
    return req.params;
  }

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
    } else {
      Logger.error(`Undefined error: ${(error as Error).stack}`, { domain: 'engagement' });

      throw error;
    }
  }
}


