/**
 * Auth Form Reducer
 * Handles all state transitions for the auth form using useReducer pattern
 */

import type { AuthFormState, AuthFormAction } from "./authForm";

export const initialAuthFormState: AuthFormState = {
  loginEmail: "",
  loginPassword: "",
  regUsername: "",
  regEmail: "",
  regPassword: "",
  regConfirmPassword: "",
  termsAccepted: false,
};

export const authFormReducer = (
  state: AuthFormState,
  action: AuthFormAction,
): AuthFormState => {
  switch (action.type) {
    case "SET_LOGIN_EMAIL":
      return { ...state, loginEmail: action.payload };
    case "SET_LOGIN_PASSWORD":
      return { ...state, loginPassword: action.payload };
    case "SET_REG_USERNAME":
      return { ...state, regUsername: action.payload };
    case "SET_REG_EMAIL":
      return { ...state, regEmail: action.payload };
    case "SET_REG_PASSWORD":
      return { ...state, regPassword: action.payload };
    case "SET_REG_CONFIRM_PASSWORD":
      return { ...state, regConfirmPassword: action.payload };
    case "SET_TERMS_ACCEPTED":
      return { ...state, termsAccepted: action.payload };
    case "RESET_FORM":
      return initialAuthFormState;
    default:
      return state;
  }
};
