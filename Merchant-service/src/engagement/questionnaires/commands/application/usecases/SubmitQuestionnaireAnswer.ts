import { Inject, Service } from 'typedi';
import QuestionnaireRepo from '../../domain/contracts/QuestionnaireRepo';
import QuestionnaireRepoImpl from '../../infrastructure/repositories/QuestionnaireRepoImpl';
import { SubmitQuestionnaireAnswerRequest } from '../models/SubmitQuestionnaireAnswerRequest';
import { QuestionnaireNotFoundError } from '../../../common/application/exceptions/QuestionnaireNotFoundError';
import { QuestionnaireNotAvailableError } from '../../../common/application/exceptions/QuestionnaireNotAvailableError';
import { AnswerStatus } from '../../domain/models/entities/QuestionnaireAnswer';
import IsMultiTenancyEnabled from '../../../../../shared-kernel/application/usecases/IsMultiTenancyEnabled';
import EnableMultiTenancy from '../../../../../shared-kernel/application/usecases/EnableMultiTenancy';

@Service({ global: true })
export default class SubmitQuestionnaireAnswer {
  private questionnaireRepo: QuestionnaireRepo;
  private isMultiTenancyEnabled: IsMultiTenancyEnabled;
  private enableMultiTenancy: EnableMultiTenancy;

  constructor(
    @Inject(() => QuestionnaireRepoImpl) questionnaireRepo: QuestionnaireRepo,
    isMultiTenancyEnabled: IsMultiTenancyEnabled,
    enableMultiTenancy: EnableMultiTenancy,
  ) {
    this.questionnaireRepo = questionnaireRepo;
    this.isMultiTenancyEnabled = isMultiTenancyEnabled;
    this.enableMultiTenancy = enableMultiTenancy;
  }

  async execute(request: SubmitQuestionnaireAnswerRequest): Promise<AnswerStatus> {
    const { questionnaireName, taagerId } = request;
    const questionnaire = await this.questionnaireRepo.findByName(questionnaireName, taagerId);
    if (!questionnaire) {
      throw new QuestionnaireNotFoundError(questionnaireName.val);
    }

    if ((await this.isMultiTenancyEnabled.execute(taagerId.val)) || questionnaire.isAnswered) {
      throw new QuestionnaireNotAvailableError(questionnaireName.val, taagerId.val);
    }

    const status = questionnaire.submitAnswers(request.answers, taagerId);
    await this.questionnaireRepo.save(questionnaire);

    if (status === AnswerStatus.PASSED) {
      await this.enableMultiTenancy.execute(taagerId.val);
    }

    return status;
  }
}


