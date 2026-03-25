/**
 * Auth Form Validation Tests
 * Unit tests for all validation functions
 */

import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePasswordMatch,
} from "../../src/utils/authFormValidation";

describe("Auth Form Validation Functions", () => {
  describe("validateEmail", () => {
    it("should return undefined for valid email", () => {
      expect(validateEmail("user@example.com")).toBeUndefined();
      expect(validateEmail("test.email+tag@domain.co.uk")).toBeUndefined();
    });

    it("should return error for empty email", () => {
      expect(validateEmail("")).toBe("Email is required");
      expect(validateEmail("   ")).toBe("Email is required");
    });

    it("should return error for invalid email format", () => {
      expect(validateEmail("notanemail")).toBe("Please enter a valid email");
      expect(validateEmail("user@")).toBe("Please enter a valid email");
      expect(validateEmail("@example.com")).toBe("Please enter a valid email");
      expect(validateEmail("user@.com")).toBe("Please enter a valid email");
    });

    it("should trim whitespace before validation", () => {
      expect(validateEmail("  user@example.com  ")).toBeUndefined();
      expect(validateEmail("\t user@example.com \n")).toBeUndefined();
    });
  });

  describe("validatePassword", () => {
    it("should return undefined for valid password", () => {
      expect(validatePassword("ValidPass123")).toBeUndefined();
      expect(validatePassword("My$ecure!Pass")).toBeUndefined();
      expect(validatePassword("12345678")).toBeUndefined();
    });

    it("should return error for empty password", () => {
      expect(validatePassword("")).toBe("Password is required");
      expect(validatePassword("   ")).toBe("Password is required");
    });

    it("should return error for password less than 8 characters", () => {
      expect(validatePassword("Pass123")).toBe(
        "Password must be at least 8 characters",
      );
      expect(validatePassword("1234567")).toBe(
        "Password must be at least 8 characters",
      );
    });

    it("should return error for non-ASCII characters", () => {
      // Greek letter (β)
      expect(validatePassword("Passβ123456")).toContain(
        "Password can only contain standard ASCII characters",
      );
      // Chinese character (中)
      expect(validatePassword("Pass中123456")).toContain(
        "Password can only contain standard ASCII characters",
      );
      // Emoji (😊)
      expect(validatePassword("Pass😊123456")).toContain(
        "Password can only contain standard ASCII characters",
      );
    });

    it("should allow common ASCII special characters", () => {
      expect(validatePassword("Pass!@#$%^&")).toBeUndefined();
      expect(validatePassword("Pass-_=+[]{}|;")).toBeUndefined();
      expect(validatePassword("Pass:,.<>?")).toBeUndefined();
    });

    it("should trim whitespace before validation", () => {
      expect(validatePassword("  ValidPass123  ")).toBeUndefined();
      expect(validatePassword("\tValidPass123\n")).toBeUndefined();
    });
  });

  describe("validateUsername", () => {
    it("should return undefined for valid username", () => {
      expect(validateUsername("user")).toBeUndefined();
      expect(validateUsername("john_doe")).toBeUndefined();
      expect(validateUsername("user123")).toBeUndefined();
    });

    it("should return error for empty username", () => {
      expect(validateUsername("")).toBe("Username is required");
      expect(validateUsername("   ")).toBe("Username is required");
    });

    it("should return error for username less than 3 characters", () => {
      expect(validateUsername("ab")).toBe(
        "Username must be at least 3 characters",
      );
      expect(validateUsername("x")).toBe(
        "Username must be at least 3 characters",
      );
    });

    it("should accept exactly 3 character username", () => {
      expect(validateUsername("abc")).toBeUndefined();
    });

    it("should trim whitespace before validation", () => {
      expect(validateUsername("  validuser  ")).toBeUndefined();
      expect(validateUsername("\tvaliduser\n")).toBeUndefined();
    });
  });

  describe("validatePasswordMatch", () => {
    it("should return undefined when passwords match", () => {
      expect(
        validatePasswordMatch("Password123", "Password123"),
      ).toBeUndefined();
    });

    it("should return error when passwords do not match", () => {
      expect(validatePasswordMatch("Password123", "Password456")).toBe(
        "Passwords do not match",
      );
    });

    it("should compare trimmed passwords", () => {
      expect(
        validatePasswordMatch("  Password123  ", "Password123"),
      ).toBeUndefined();
      expect(
        validatePasswordMatch("Password123", "  Password123  "),
      ).toBeUndefined();
    });

    it("should be case-sensitive", () => {
      expect(validatePasswordMatch("Password123", "password123")).toBe(
        "Passwords do not match",
      );
    });
  });
});
