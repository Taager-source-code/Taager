import { DomainEntity } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import TaagerId from '../valueobjects/TaagerId';
import { Score } from '../valueobjects/ValueObjects';
import { QuestionGivenAnswerCalculation } from '../valueobjects/QuestionGivenAnswerCalculation';

export enum AnswerStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  DECLINED = 'declined',
}

export default class QuestionnaireAnswer implements DomainEntity {
  private readonly _taagerId: TaagerId;
  private _status: AnswerStatus;
  private _totalScore?: Score;
  private _answers?: QuestionGivenAnswerCalculation[];

  constructor(
    taagerId: TaagerId,
    status: AnswerStatus,
    totalScore?: Score,
    answers?: QuestionGivenAnswerCalculation[],
  ) {
    this._taagerId = taagerId;
    this._totalScore = totalScore;
    this._status = status;
    this._answers = answers;
  }

  public static decline(taagerId: TaagerId): QuestionnaireAnswer {
    return new QuestionnaireAnswer(taagerId, AnswerStatus.DECLINED);
  }

  public static passed(
    taagerId: TaagerId,
    totalScore: Score,
    answers: QuestionGivenAnswerCalculation[],
  ): QuestionnaireAnswer {
    return new QuestionnaireAnswer(taagerId, AnswerStatus.PASSED, totalScore, answers);
  }

  public static failed(
    taagerId: TaagerId,
    totalScore: Score,
    answers: QuestionGivenAnswerCalculation[],
  ): QuestionnaireAnswer {
    return new QuestionnaireAnswer(taagerId, AnswerStatus.FAILED, totalScore, answers);
  }

  // region getter

  get taagerId(): TaagerId {
    return this._taagerId;
  }

  get status(): AnswerStatus {
    return this._status;
  }

  get totalScore(): Score | undefined {
    return this._totalScore;
  }

  get answers(): QuestionGivenAnswerCalculation[] | undefined {
    return this._answers;
  }
}


