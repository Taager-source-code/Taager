import { Service } from 'typedi';
import joi from 'joi';
import { NOT_FOUND, OK } from 'http-status';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import { Request } from 'express';
import IsQuestionnaireEnabled from '../../application/usecases/IsQuestionnaireEnabled';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { QuestionnaireNotFoundError } from '../../../common/application/exceptions/QuestionnaireNotFoundError';

@Service({ global: true })
export default class IsQuestionnaireEnabledController extends HttpProcessor {
  private isQuestionnaireEnabled: IsQuestionnaireEnabled;

  constructor(isQuestionnaireEnabled: IsQuestionnaireEnabled) {
    super();
    this.isQuestionnaireEnabled = isQuestionnaireEnabled;
  }

  async execute(req, joiValue): Promise<HttpSuccess | HttpError> {
    const taagerId = req.decodedToken.user.TagerID;
    try {
      const questionnaireAnswerStatus = await this.isQuestionnaireEnabled.execute(joiValue.questionnaireName, taagerId);
      return { status: OK, data: { enabled: questionnaireAnswerStatus.enabled } };
    } catch (error) {
      return this.handleError(error, joiValue);
    }
  }

  schema = joi
    .object({ questionnaireName: joi.string().required() })
    .options({ allowUnknown: true, stripUnknown: true });

  getValueToValidate(req: Request): any {
    return req.params;
  }

  private handleError(error: any, joiValue): HttpError {
    if (error instanceof QuestionnaireNotFoundError) {
      Logger.info(`Questionnaire not found: ${error.stack}`, { domain: 'engagement' });

      return {
        status: NOT_FOUND,
        errorCode: 'questionnaires-0001',
        description: 'Questionnaire not found',
        message: `Questionnaire with name=${joiValue.questionnaireName} not found`,
      };
    } else {
      Logger.error(`Undefined error: ${(error as Error).stack}`, { domain: 'engagement' });

      throw error;
    }
  }
}


