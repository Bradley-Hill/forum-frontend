import { describe, it, expect, beforeEach } from "vitest";
import {
  authFormReducer,
  initialAuthFormState,
} from "../../src/types/authFormReducer";
import type { AuthFormState, AuthFormAction } from "../../src/types/authForm";

describe("Auth Form Reducer", () => {
  let state: AuthFormState;

  beforeEach(() => {
    state = initialAuthFormState;
  });

  describe("Initial State", () => {
    it("should have correct initial state structure", () => {
      expect(state).toEqual({
        loginEmail: "",
        loginPassword: "",
        regUsername: "",
        regEmail: "",
        regPassword: "",
        regConfirmPassword: "",
        termsAccepted: false,
      });
    });

    it("should not mutate initial state object", () => {
      const initialCopy = { ...initialAuthFormState };
      authFormReducer(state, {
        type: "SET_LOGIN_EMAIL",
        payload: "test@example.com",
      });
      expect(initialAuthFormState).toEqual(initialCopy);
    });
  });

  describe("Login Form Actions", () => {
    it("should handle SET_LOGIN_EMAIL action", () => {
      const action: AuthFormAction = {
        type: "SET_LOGIN_EMAIL",
        payload: "user@example.com",
      };
      const newState = authFormReducer(state, action);

      expect(newState.loginEmail).toBe("user@example.com");
      expect(newState.loginPassword).toBe("");
      expect(state.loginEmail).toBe("");
    });

    it("should handle SET_LOGIN_PASSWORD action", () => {
      const action: AuthFormAction = {
        type: "SET_LOGIN_PASSWORD",
        payload: "SecurePass123",
      };
      const newState = authFormReducer(state, action);

      expect(newState.loginPassword).toBe("SecurePass123");
      expect(newState.loginEmail).toBe("");
    });

    it("should chain multiple login actions", () => {
      let newState = authFormReducer(state, {
        type: "SET_LOGIN_EMAIL",
        payload: "user@example.com",
      });

      newState = authFormReducer(newState, {
        type: "SET_LOGIN_PASSWORD",
        payload: "password123",
      });

      expect(newState.loginEmail).toBe("user@example.com");
      expect(newState.loginPassword).toBe("password123");
    });
  });

  describe("Register Form Actions", () => {
    it("should handle SET_REG_USERNAME action", () => {
      const action: AuthFormAction = {
        type: "SET_REG_USERNAME",
        payload: "johndoe",
      };
      const newState = authFormReducer(state, action);

      expect(newState.regUsername).toBe("johndoe");
    });

    it("should handle SET_REG_EMAIL action", () => {
      const action: AuthFormAction = {
        type: "SET_REG_EMAIL",
        payload: "john@example.com",
      };
      const newState = authFormReducer(state, action);

      expect(newState.regEmail).toBe("john@example.com");
    });

    it("should handle SET_REG_PASSWORD action", () => {
      const action: AuthFormAction = {
        type: "SET_REG_PASSWORD",
        payload: "MySecurePass123",
      };
      const newState = authFormReducer(state, action);

      expect(newState.regPassword).toBe("MySecurePass123");
    });

    it("should handle SET_REG_CONFIRM_PASSWORD action", () => {
      const action: AuthFormAction = {
        type: "SET_REG_CONFIRM_PASSWORD",
        payload: "MySecurePass123",
      };
      const newState = authFormReducer(state, action);

      expect(newState.regConfirmPassword).toBe("MySecurePass123");
    });

    it("should chain all register actions", () => {
      let newState = state;

      newState = authFormReducer(newState, {
        type: "SET_REG_USERNAME",
        payload: "johndoe",
      });
      newState = authFormReducer(newState, {
        type: "SET_REG_EMAIL",
        payload: "john@example.com",
      });
      newState = authFormReducer(newState, {
        type: "SET_REG_PASSWORD",
        payload: "SecurePass123",
      });
      newState = authFormReducer(newState, {
        type: "SET_REG_CONFIRM_PASSWORD",
        payload: "SecurePass123",
      });

      expect(newState.regUsername).toBe("johndoe");
      expect(newState.regEmail).toBe("john@example.com");
      expect(newState.regPassword).toBe("SecurePass123");
      expect(newState.regConfirmPassword).toBe("SecurePass123");
    });
  });

  describe("Terms Acceptance Action", () => {
    it("should handle SET_TERMS_ACCEPTED action (true)", () => {
      const action: AuthFormAction = {
        type: "SET_TERMS_ACCEPTED",
        payload: true,
      };
      const newState = authFormReducer(state, action);

      expect(newState.termsAccepted).toBe(true);
    });

    it("should handle SET_TERMS_ACCEPTED action (false)", () => {
      let newState = authFormReducer(state, {
        type: "SET_TERMS_ACCEPTED",
        payload: true,
      });

      newState = authFormReducer(newState, {
        type: "SET_TERMS_ACCEPTED",
        payload: false,
      });

      expect(newState.termsAccepted).toBe(false);
    });
  });

  describe("Reset Form Action", () => {
    it("should reset form to initial state", () => {
      let newState = state;

      // Fill in all fields
      newState = authFormReducer(newState, {
        type: "SET_LOGIN_EMAIL",
        payload: "user@example.com",
      });
      newState = authFormReducer(newState, {
        type: "SET_REG_USERNAME",
        payload: "testuser",
      });
      newState = authFormReducer(newState, {
        type: "SET_TERMS_ACCEPTED",
        payload: true,
      });

      // Verify fields are set
      expect(newState.loginEmail).toBe("user@example.com");
      expect(newState.regUsername).toBe("testuser");
      expect(newState.termsAccepted).toBe(true);

      // Reset
      newState = authFormReducer(newState, { type: "RESET_FORM" });

      // Verify all fields are cleared
      expect(newState).toEqual(initialAuthFormState);
    });
  });

  describe("Unknown Action", () => {
    it("should return current state for unknown action type", () => {
      const newState = authFormReducer(state, {
        type: "UNKNOWN_ACTION" as any,
        payload: "test",
      });

      expect(newState).toBe(state);
    });
  });

  describe("State Immutability", () => {
    it("should not mutate original state on update", () => {
      const originalState = { ...state };

      authFormReducer(state, {
        type: "SET_LOGIN_EMAIL",
        payload: "new@example.com",
      });

      expect(state).toEqual(originalState);
    });

    it("should preserve other fields when updating one", () => {
      let newState = state;

      // Set multiple fields
      newState = authFormReducer(newState, {
        type: "SET_LOGIN_EMAIL",
        payload: "email@example.com",
      });
      newState = authFormReducer(newState, {
        type: "SET_REG_USERNAME",
        payload: "username123",
      });

      // Update one field
      newState = authFormReducer(newState, {
        type: "SET_LOGIN_PASSWORD",
        payload: "password123",
      });

      // Verify other fields are preserved
      expect(newState.loginEmail).toBe("email@example.com");
      expect(newState.regUsername).toBe("username123");
      expect(newState.loginPassword).toBe("password123");
    });
  });
});
