import IncentiveProgram from '../models/incentive-program/IncentiveProgram';

export default interface IncentiveProgramRepository {
  getConfirmedOrdersCount(TagerID: number, startDate: string, endDate: string): Promise<number>;

  getDefaultIncentiveProgram(): Promise<IncentiveProgram | null>;

  getByTagerId(tagerID): Promise<IncentiveProgram | null>;
}


