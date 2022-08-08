import {
  SubmitQuestionnaireAnswerRequest,
  SubmittedAnswer,
} from '../../../application/models/SubmitQuestionnaireAnswerRequest';
import { AnswerId, QuestionId } from '../../../domain/models/valueobjects/IdValueObjects';
import QuestionnaireName from '../../../domain/models/valueobjects/QuestionnaireName';
import TaagerId from '../../../domain/models/valueobjects/TaagerId';

export default class SubmitQuestionnaireAnswerDtoConverter {
  public static toModel(request: any, taagerId: string, questionnaireName: string): SubmitQuestionnaireAnswerRequest {
    return {
      taagerId: new TaagerId(taagerId),
      questionnaireName: new QuestionnaireName(questionnaireName),
      answers: request.answers.map(a => {
        return this.toAnswerModel(a);
      }),
    };
  }

  private static toAnswerModel(a): SubmittedAnswer {
    return {
      questionId: new QuestionId(a.questionId),
      answerIds: a.answerIds.map(a => {
        return new AnswerId(a);
      }),
    };
  }
}


