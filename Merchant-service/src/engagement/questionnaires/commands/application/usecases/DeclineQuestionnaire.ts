import { Inject, Service } from 'typedi';
import QuestionnaireName from '../../domain/models/valueobjects/QuestionnaireName';
import TaagerId from '../../domain/models/valueobjects/TaagerId';
import QuestionnaireRepo from '../../domain/contracts/QuestionnaireRepo';
import QuestionnaireRepoImpl from '../../infrastructure/repositories/QuestionnaireRepoImpl';
import { QuestionnaireNotAvailableError } from '../../../common/application/exceptions/QuestionnaireNotAvailableError';
import { QuestionnaireNotFoundError } from '../../../common/application/exceptions/QuestionnaireNotFoundError';
import IsMultiTenancyEnabled from '../../../../../shared-kernel/application/usecases/IsMultiTenancyEnabled';

@Service({ global: true })
export default class DeclineQuestionnaire {
  private questionnaireRepo: QuestionnaireRepo;
  private isMultiTenancyEnabled: IsMultiTenancyEnabled;

  constructor(
    @Inject(() => QuestionnaireRepoImpl) questionnaireRepo: QuestionnaireRepo,
    isMultiTenancyEnabled: IsMultiTenancyEnabled,
  ) {
    this.questionnaireRepo = questionnaireRepo;
    this.isMultiTenancyEnabled = isMultiTenancyEnabled;
  }

  async execute(questionnaireName: QuestionnaireName, taagerId: TaagerId): Promise<void> {
    const questionnaire = await this.questionnaireRepo.findByName(questionnaireName, taagerId);
    if (!questionnaire) {
      throw new QuestionnaireNotFoundError(questionnaireName.val);
    }

    if ((await this.isMultiTenancyEnabled.execute(taagerId.val)) || questionnaire.isAnswered) {
      throw new QuestionnaireNotAvailableError(questionnaireName.val, taagerId.val);
    }

    questionnaire.decline(taagerId);
    await this.questionnaireRepo.save(questionnaire);
  }
}


