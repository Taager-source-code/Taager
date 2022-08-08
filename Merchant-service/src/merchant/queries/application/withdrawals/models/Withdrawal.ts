export default interface Withdrawal {
  id?: string;
  taagerId?: number;
  fullName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  phoneNum: string;
  status: string;
  createdAt?: Date;
  rejectReason?: string;
}


