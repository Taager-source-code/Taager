import { AggregateRoot } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import QuestionnaireName from '../valueobjects/QuestionnaireName';
import QuestionnaireQuestion from '../valueobjects/QuestionnaireQuestion';
import QuestionnaireAnswer, { AnswerStatus } from '../entities/QuestionnaireAnswer';
import { AnswerId, QuestionId } from '../valueobjects/IdValueObjects';
import TaagerId from '../valueobjects/TaagerId';
import { UnansweredQuestionError } from '../../exceptions/UnansweredQuestionError';
import { QuestionGivenAnswerCalculation } from '../valueobjects/QuestionGivenAnswerCalculation';
import { Score } from '../valueobjects/ValueObjects';

type GivenAnswer = {
  questionId: QuestionId;
  answerIds: AnswerId[];
};

export default class Questionnaire extends AggregateRoot {
  private readonly _name: QuestionnaireName;
  private readonly _questions: QuestionnaireQuestion[];
  private readonly _passingScore: Score;
  private _answer?: QuestionnaireAnswer;

  constructor(
    name: QuestionnaireName,
    questions: QuestionnaireQuestion[],
    passingScore: Score,
    answer?: QuestionnaireAnswer,
  ) {
    super();
    this._name = name;
    this._questions = questions;
    this._passingScore = passingScore;
    this._answer = answer;
  }

  // region getters

  get name(): QuestionnaireName {
    return this._name;
  }

  get questions(): QuestionnaireQuestion[] {
    return this._questions;
  }

  get passingScore(): Score {
    return this._passingScore;
  }

  get answer(): QuestionnaireAnswer | undefined {
    return this._answer;
  }

  // endregion

  get isAnswered(): boolean {
    return this._answer !== null && this._answer !== undefined;
  }

  decline(taagerId: TaagerId) {
    this._answer = QuestionnaireAnswer.decline(taagerId);
    return this._answer.status;
  }

  submitAnswers(answers: GivenAnswer[], taagerId: TaagerId): AnswerStatus {
    const scorePerQuestion = this._questions.map(question => this.calculateScorePerQuestion(question, answers));

    const totalScore = this.sumUpWithCapping(scorePerQuestion);

    this._answer = this.generateFinalAnswer(taagerId, totalScore, scorePerQuestion);
    return this._answer.status;
  }

  private calculateScorePerQuestion(
    question: QuestionnaireQuestion,
    answers: GivenAnswer[],
  ): QuestionGivenAnswerCalculation {
    const answer = answers.find(answer => answer.questionId.equals(question.id));
    if (!answer) {
      throw new UnansweredQuestionError(question.id.val);
    }

    const scoreResult = question.calculateScore(answer.answerIds);
    return new QuestionGivenAnswerCalculation(question.id, answer.answerIds, scoreResult.score, scoreResult.scoreCap);
  }

  private sumUpWithCapping(scorePerQuestion: QuestionGivenAnswerCalculation[]): Score {
    return scorePerQuestion.reduce((prev: Score, curr) => prev.plus(curr.score), Score.ZERO);
  }

  private generateFinalAnswer(
    taagerId: TaagerId,
    totalScore: Score,
    scorePerQuestion: QuestionGivenAnswerCalculation[],
  ): QuestionnaireAnswer {
    if (totalScore.greaterOrEqualTo(this._passingScore)) {
      return QuestionnaireAnswer.passed(taagerId, totalScore, scorePerQuestion);
    } else {
      return QuestionnaireAnswer.failed(taagerId, totalScore, scorePerQuestion);
    }
  }
}


