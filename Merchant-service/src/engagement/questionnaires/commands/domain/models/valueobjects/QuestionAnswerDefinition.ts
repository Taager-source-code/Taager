import { ValueObject } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import { Score, MultilingualText } from './ValueObjects';
import { AnswerId } from './IdValueObjects';

export class QuestionAnswerDefinition implements ValueObject {
  private readonly _id: AnswerId;
  private _iconUrl?: string;
  private _text: MultilingualText;
  private _score: Score;

  constructor(id: AnswerId, text: MultilingualText, score: Score, iconUrl?: string) {
    this._id = id;
    this._iconUrl = iconUrl;
    this._text = text;
    this._score = score;
  }

  // region getters

  get id(): AnswerId {
    return this._id;
  }

  get iconUrl(): string | undefined {
    return this._iconUrl;
  }

  get text(): MultilingualText {
    return this._text;
  }

  get score(): Score {
    return this._score;
  }
}


