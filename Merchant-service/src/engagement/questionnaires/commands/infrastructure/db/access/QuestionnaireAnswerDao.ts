import { Service } from 'typedi';
import { QuestionnaireAnswerModel } from '../../../../common/infrastructure/db/models/QuestionnaireAnswerModel';
import QuestionnaireAnswerSchema from '../../../../common/infrastructure/db/schemas/QuestionnaireAnswerSchema';

@Service({ global: true })
export default class QuestionnaireAnswerDao {
  async save(questionnaireAnswer: QuestionnaireAnswerModel): Promise<void> {
    await QuestionnaireAnswerSchema.replaceOne(
      { questionnaireName: questionnaireAnswer.questionnaireName, taagerId: questionnaireAnswer.taagerId },
      questionnaireAnswer,
      {
        upsert: true,
      },
    );
  }

  async findByQuestionnaireNameAndTaagerId(
    questionnaireName: string,
    taagerId: string,
  ): Promise<QuestionnaireAnswerModel | null> {
    return QuestionnaireAnswerSchema.findOne({ questionnaireName: questionnaireName, taagerId: taagerId }).exec();
  }
}


