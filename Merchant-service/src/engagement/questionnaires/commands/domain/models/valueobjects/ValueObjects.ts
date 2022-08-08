import { ValueObject } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import {
  MaxAllowedAnswerCantBeNegativeException,
  ScoreCantBeNegativeException,
  ScoreCapCantBeNegativeException,
} from '../../exceptions/IllegalValueException';
import { MissingTextLanguageError } from '../../exceptions/MissingTextLanguageError';

export class MaxAllowedAnswers implements ValueObject {
  private readonly _val: number;

  constructor(val: number) {
    if (val < 0) {
      throw new MaxAllowedAnswerCantBeNegativeException(val);
    }
    this._val = val;
  }

  get val(): number {
    return this._val;
  }
}

export class ScoreCap implements ValueObject {
  private readonly _val: number;

  constructor(val: number) {
    if (val < 0) {
      throw new ScoreCapCantBeNegativeException(val);
    }
    this._val = val;
  }

  get val(): number {
    return this._val;
  }

  toScore(): Score {
    return new Score(this._val);
  }
}

export class MultilingualText implements ValueObject {
  private readonly _en: string;
  private readonly _ar: string;

  constructor(en: string, ar: string) {
    if (!en) {
      throw new MissingTextLanguageError('en');
    } else if (!ar) {
      throw new MissingTextLanguageError('ar');
    }
    this._en = en;
    this._ar = ar;
  }

  get en(): string {
    return this._en;
  }

  get ar(): string {
    return this._ar;
  }
}

export class Score implements ValueObject {
  public static readonly ZERO = new Score(0);

  private readonly _val: number;

  constructor(val: number) {
    if (val < 0) {
      throw new ScoreCantBeNegativeException(val);
    }
    this._val = val;
  }

  get val(): number {
    return this._val;
  }

  public plus(other: Score): Score {
    return new Score(this._val + other._val);
  }

  public greaterOrEqualTo(other: Score): boolean {
    return this._val >= other._val;
  }

  public static min(first: Score, second: Score): Score {
    if (first.val > second._val) {
      return second;
    } else {
      return first;
    }
  }
}


