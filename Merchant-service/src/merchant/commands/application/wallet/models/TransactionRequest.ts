export default interface TransactionRequest {
  userId: string;
  currency: string;
  serviceTransactionId: string;
  serviceType: string;
  serviceSubType: string;
  amount: number;
}


