import { AxiosError } from "axios";

export type User = {
  id?: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number?: string,
  password?: string,
  reset_password_expired?: number,
  reset_password_token?: string,
  avatar_url?: string
};

export type ResponseOnUserPostRequest = {
  isSucceed: boolean,
  id?: string,
  error?: AxiosError | string,
  message?: string,
  subMessage?: string,
  data?: any
};

export type ResetPasswordRequest = {
  userNewPassword: string,
  resetToken: string
}
