import { ValueObject } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import { AnswerId, QuestionId } from './IdValueObjects';
import { MaxAllowedAnswers, Score, ScoreCap, MultilingualText } from './ValueObjects';
import { QuestionAnswerDefinition } from './QuestionAnswerDefinition';
import { NonExistentAnswerOptionError } from '../../exceptions/NonExistentAnswerOptionError';
import { UnansweredQuestionError } from '../../exceptions/UnansweredQuestionError';
import { TooManyAnswersError } from '../../exceptions/TooManyAnswersError';

export default class QuestionnaireQuestion implements ValueObject {
  private readonly _id: QuestionId;
  private readonly _text: MultilingualText;
  private _iconUrl?: string;
  private _maxAllowedAnswers?: MaxAllowedAnswers;
  private _scoreCap: ScoreCap;
  private _answers: QuestionAnswerDefinition[];

  constructor(
    id: QuestionId,
    text: MultilingualText,
    scoreCap: ScoreCap,
    answers: QuestionAnswerDefinition[],
    iconUrl?: string,
    maxAllowedAnswers?: MaxAllowedAnswers,
  ) {
    this._id = id;
    this._text = text;
    this._iconUrl = iconUrl;
    this._maxAllowedAnswers = maxAllowedAnswers;
    this._scoreCap = scoreCap;
    this._answers = answers;
  }

  // region getters

  get id(): QuestionId {
    return this._id;
  }

  get text(): MultilingualText {
    return this._text;
  }

  get iconUrl(): string | undefined {
    return this._iconUrl;
  }

  get maxAllowedAnswers(): MaxAllowedAnswers | undefined {
    return this._maxAllowedAnswers;
  }

  get answers(): QuestionAnswerDefinition[] {
    return this._answers;
  }

  get scoreCap(): ScoreCap {
    return this._scoreCap;
  }

  public calculateScore(answerIds: AnswerId[]): { score: Score; scoreCap: ScoreCap } {
    this.validateAnswerSize(answerIds);

    const scoreSum = answerIds
      .map(answerId => this.extractScore(answerId))
      .reduce((prev: Score, curr: Score) => prev.plus(curr), Score.ZERO);

    const scoreSumVsScoreCapMinimum = Score.min(this._scoreCap.toScore(), scoreSum);
    return { score: scoreSumVsScoreCapMinimum, scoreCap: this._scoreCap };
  }

  private validateAnswerSize(answerIds: AnswerId[]) {
    if (!answerIds) {
      throw new UnansweredQuestionError(this._id.val);
    }

    if (this._maxAllowedAnswers && answerIds.length > this._maxAllowedAnswers.val) {
      throw new TooManyAnswersError(this._id.val, this._maxAllowedAnswers.val, answerIds.length);
    }
  }

  private extractScore(aId: AnswerId) {
    const answer = this._answers.find(a => a.id.equals(aId));
    if (!answer) {
      throw new NonExistentAnswerOptionError(this._id.val, aId.val);
    }

    return answer.score;
  }
}


