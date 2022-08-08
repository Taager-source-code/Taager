import { QuestionnaireAnswerModel } from '../../../common/infrastructure/db/models/QuestionnaireAnswerModel';

export default interface QuestionnaireAnswerRepo {
  findByQuestionnaireNameAndTaagerId(
    questionnaireName: string,
    taagerId: string,
  ): Promise<QuestionnaireAnswerModel | null>;
}


