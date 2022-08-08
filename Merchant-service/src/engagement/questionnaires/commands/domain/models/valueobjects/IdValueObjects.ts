import { ValueObject } from '../../../../../../shared-kernel/domain/base/AggregateRoot';
import { v4 as uuid } from 'uuid';

export class QuestionId implements ValueObject {
  private readonly _val: string;

  constructor(val: string) {
    this._val = val;
  }

  static validId(): QuestionId {
    return new QuestionId(uuid());
  }

  get val(): string {
    return this._val;
  }

  equals(questionId: QuestionId) {
    return this._val === questionId._val;
  }
}

export class AnswerId implements ValueObject {
  private readonly _val: string;

  constructor(val: string) {
    this._val = val;
  }

  static validId(): AnswerId {
    return new AnswerId(uuid());
  }

  get val(): string {
    return this._val;
  }

  equals(answerId: AnswerId) {
    return this._val === answerId._val;
  }
}


