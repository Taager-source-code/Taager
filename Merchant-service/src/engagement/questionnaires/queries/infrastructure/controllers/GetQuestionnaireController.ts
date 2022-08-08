import { Service } from 'typedi';
import joi from 'joi';
import { NOT_FOUND, OK } from 'http-status';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import { Request } from 'express';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import GetQuestionnaire from '../../application/usecases/GetQuestionnaire';
import QuestionnaireDtoConverter from './converters/QuestionnaireDtoConverter';
import { QuestionnaireNotFoundError } from '../../../common/application/exceptions/QuestionnaireNotFoundError';
import { QuestionnaireNotAvailableError } from '../../../common/application/exceptions/QuestionnaireNotAvailableError';

@Service({ global: true })
export default class GetQuestionnaireController extends HttpProcessor {
  private getQuestionnaire: GetQuestionnaire;

  constructor(getQuestionnaire: GetQuestionnaire) {
    super();
    this.getQuestionnaire = getQuestionnaire;
  }

  async execute(req, joiValue): Promise<HttpSuccess | HttpError> {
    const taagerId = req.decodedToken.user.TagerID;
    const questionnaireName = joiValue.questionnaireName;
    try {
      const questionnaire = await this.getQuestionnaire.execute(questionnaireName, taagerId);
      return { status: OK, data: QuestionnaireDtoConverter.toQuestionnaireDto(questionnaire) };
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
    }
    {
      Logger.error(`Undefined error: ${(error as Error).stack}`, { domain: 'engagement' });

      throw error;
    }
  }
}


