export default interface ResetPasswordRequest {
  userId: string;
  email?: string;
  username: string;
  resetPasswordToken?: string;
}


