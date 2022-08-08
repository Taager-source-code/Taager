import { ValueObject } from '../../../../../../shared-kernel/domain/base/AggregateRoot';

export default class QuestionnaireName implements ValueObject {
  private readonly _val: string;

  constructor(val: string) {
    this._val = val;
  }

  get val(): string {
    return this._val;
  }
}


