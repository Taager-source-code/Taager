export default interface WithdrawalQuery {
  page: number;
  pageSize: number;
  userId: string;
  status?: string[] | null;
  fromDate?: string | null;
  toDate?: string | null;
  currency?: string | null;
}


