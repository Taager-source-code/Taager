import QuestionnaireName from '../../domain/models/valueobjects/QuestionnaireName';
import { AnswerId, QuestionId } from '../../domain/models/valueobjects/IdValueObjects';
import TaagerId from '../../domain/models/valueobjects/TaagerId';

export type SubmitQuestionnaireAnswerRequest = {
  taagerId: TaagerId;
  questionnaireName: QuestionnaireName;
  answers: SubmittedAnswer[];
};

export type SubmittedAnswer = {
  questionId: QuestionId;
  answerIds: AnswerId[];
};


