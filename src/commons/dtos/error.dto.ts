import { z } from "zod";

// - https://developer.mozilla.org/en-US/docs/Web/HTTP
export const ErrorName = z.enum([
  "CONFLICT",
  "NO_CONTENT",
  "WARNING",
  "NOT_PROCESSED",
  "SERVER_ERROR",
  "BAD_REQUEST",
  "USER_ERROR",
  "VALIDATION_ERROR",
  "AUTHENTICATION_ERROR",
  "AUTHORIZATION_ERROR",
  "NOT_FOUND",
  "NO_AVAILABLE_VENDOR",
  "NOT_IN_YOUR_LOCATION",
  "DATABASE_ERROR",
  "NOT_IMPLEMENTED",
  "PAYMENT_ERROR",
  "PERMISSION_ERROR",
  "UNPROCESSED_ERROR",
  "TIME_OUT",
]);

export type ErrorName = z.infer<typeof ErrorName>;

export type TError = {
  name: ErrorName;
  message: string;
  cause: string;
  code: number;
  stack?: string;
};
