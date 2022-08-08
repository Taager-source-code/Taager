export default interface WithdrawalRequest {
  userId: string;
  taagerId: number;
  amount: number;
  paymentMethod: string;
  phoneNum: string;
  currency: string;
}


