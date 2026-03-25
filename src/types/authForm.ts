export interface AuthFormFieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export interface AuthFormState {
  loginEmail: string;
  loginPassword: string;
  regUsername: string;
  regEmail: string;
  regPassword: string;
  regConfirmPassword: string;
  termsAccepted: boolean;
}

export type AuthFormAction =
  | { type: "SET_LOGIN_EMAIL"; payload: string }
  | { type: "SET_LOGIN_PASSWORD"; payload: string }
  | { type: "SET_REG_USERNAME"; payload: string }
  | { type: "SET_REG_EMAIL"; payload: string }
  | { type: "SET_REG_PASSWORD"; payload: string }
  | { type: "SET_REG_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_TERMS_ACCEPTED"; payload: boolean }
  | { type: "RESET_FORM" };
