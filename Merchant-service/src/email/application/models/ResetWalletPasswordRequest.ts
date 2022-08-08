export default interface ResetWalletPasswordRequest {
  userId: string;
  email?: string;
  username: string;
  resetWalletPasswordToken?: string;
}


