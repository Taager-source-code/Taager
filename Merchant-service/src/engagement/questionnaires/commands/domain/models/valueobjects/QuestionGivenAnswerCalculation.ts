import { ValueObject } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import { Score, ScoreCap } from './ValueObjects';
import { AnswerId, QuestionId } from './IdValueObjects';

export class QuestionGivenAnswerCalculation implements ValueObject {
  private _questionId: QuestionId;
  private _answerIds: AnswerId[];
  private _score: Score;
  private _scoreCap: ScoreCap;

  constructor(questionId: QuestionId, answerIds: AnswerId[], score: Score, scoreCap: ScoreCap) {
    this._questionId = questionId;
    this._answerIds = answerIds;
    this._score = score;
    this._scoreCap = scoreCap;
  }

  // region getters

  get questionId(): QuestionId {
    return this._questionId;
  }

  get answerIds(): AnswerId[] {
    return this._answerIds;
  }

  get score(): Score {
    return this._score;
  }

  get scoreCap(): ScoreCap {
    return this._scoreCap;
  }
}


