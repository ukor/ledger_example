import type { FastifyReply, FastifyRequest } from "fastify";
import {
  type ZodFastifySchemaValidationError,
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import * as jose from "jose";

import type { ZodIssue } from "zod";
import { ErrorName, type TError } from "../dtos/error.dto";
import {
  type ResponseMessage,
  ResponseMessageType,
} from "../dtos/response_message.dto";
// import { Log } from '@foodbag/logger';

export const criticalErrors = [
  "SERVER_ERROR",
  ErrorName.enum.SERVER_ERROR.toString(),
  ErrorName.enum.DATABASE_ERROR.toString(),
  ErrorName.enum.NOT_IMPLEMENTED.toString(),
  "PAYMENT_ERROR",
  "ReferenceError",
  "MongoError",
  "BSONError",
];

const defaultErrorMessage = (name: ErrorName) => {
  switch (name) {
    case ErrorName.enum.NO_CONTENT:
      return "The resources you request for was not found.";
    case ErrorName.enum.WARNING:
    case ErrorName.enum.NOT_PROCESSED:
      return "Unable to process request";
    case ErrorName.enum.USER_ERROR:
    case ErrorName.enum.BAD_REQUEST:
    case ErrorName.enum.VALIDATION_ERROR:
      return "Bad request. Check that you are sending the right data.";
    case ErrorName.enum.AUTHENTICATION_ERROR:
      return "Invalid authentication credentials";
    case ErrorName.enum.AUTHORIZATION_ERROR:
      return "Your session has expired. Try login again";
    case ErrorName.enum.NOT_FOUND:
      return "The resources you request for was not found.";
    case ErrorName.enum.PAYMENT_ERROR:
      return "There was error processing your payment.";
    case ErrorName.enum.SERVER_ERROR:
    case ErrorName.enum.DATABASE_ERROR:
      return "We messed up on our end. We are working to fix this.";
    case ErrorName.enum.NOT_IMPLEMENTED:
      return "We do not currently support this functionality. We are working on it.";
    case ErrorName.enum.PERMISSION_ERROR:
      return "You don't have the nessecary permission to perform this action.";
    case ErrorName.enum.NOT_IN_YOUR_LOCATION:
      return "We are currently not in your region. Check back later";
    case ErrorName.enum.NO_AVAILABLE_VENDOR:
      return "There are no available vendor. Try again latter";
    case ErrorName.enum.UNPROCESSED_ERROR:
      return "Payment was not processed";
    case ErrorName.enum.TIME_OUT:
      return "A timeout occured. Try again or check your internet connection";
    default:
      return "Something went wrong reach out to suport for help.";
  }
};

const errorCode = (name: ErrorName) => {
  switch (name) {
    case "NO_CONTENT":
    case ErrorName.enum.NO_CONTENT:
      return 204;
    case ErrorName.enum.WARNING:
    case ErrorName.enum.NOT_PROCESSED:
      return 422;
    case ErrorName.enum.USER_ERROR:
    case ErrorName.enum.BAD_REQUEST:
    case ErrorName.enum.VALIDATION_ERROR:
    case ErrorName.enum.PAYMENT_ERROR:
      return 400;
    case ErrorName.enum.AUTHENTICATION_ERROR:
      return 401;
    case "NOT_FOUND":
    case ErrorName.enum.NOT_FOUND:
    case ErrorName.enum.NOT_IN_YOUR_LOCATION:
      return 404;
    case ErrorName.enum.DATABASE_ERROR:
    case ErrorName.enum.SERVER_ERROR:
      return 500;
    case ErrorName.enum.NOT_IMPLEMENTED:
      return 501;
    case ErrorName.enum.PERMISSION_ERROR:
      return 403;
    case "TIME_OUT":
    case ErrorName.enum.TIME_OUT:
      return 408;
    default:
      return 400;
  }
};

/**
 * [See Article](https://engineering.udacity.com/handling-errors-like-a-pro-in-typescript-d7a314ad4991)
 */
export class ErrorBase<T extends string> extends Error {
  override name: T | string;

  override message: string;

  override cause: unknown;

  code: number;

  constructor(error: TError) {
    super();

    this.name = error.name;
    this.message = error.message;
    this.cause = error.cause;
    this.code = error.code;
    this.stack = error.stack ?? error.cause;
  }
}

export class Exception extends ErrorBase<ErrorName> {
  constructor(name: ErrorName, message?: string, cause?: string) {
    super({
      name,
      message: message ?? defaultErrorMessage(name),
      cause: cause ?? message ?? defaultErrorMessage(name),
      code: errorCode(name),
      stack: cause ?? message ?? defaultErrorMessage(name),
    });
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors
 */
function isJavascriptError(error: unknown): boolean {
  return (
    error instanceof ReferenceError ||
    error instanceof TypeError ||
    error instanceof URIError ||
    error instanceof RangeError ||
    error instanceof SyntaxError
  );
}

export function parseZodError(errors: ZodIssue[]) {
  // ---

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const e = errors.map((e: { message: any; path: any[]; }) => {
    // ---

    return `${e.message} at ${e.path.join(".")}`;
  });

  return `- ${e.join(", -")}`;
  // return JSON.stringify(e);
}

export function fastifyErrorHandler(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // ---

  const message: ResponseMessage = {
    name: ErrorName.enum.BAD_REQUEST,
    type: ResponseMessageType.enum.error,
    text: "",
    details: "",
  };

  if (hasZodFastifySchemaValidationErrors(error)) {
    request.log.error(error);

    const zodIssues = error.validation.map(
      (e: ZodFastifySchemaValidationError) => {
        // ---

        return e.params.issue;
      },
    );

    const zodMessage = parseZodError(zodIssues);

    return reply.code(400).send({
      message: {
        ...message,
        text: zodMessage,
        name: ErrorName.enum.BAD_REQUEST,
        description: `${error.message}. ${zodMessage}`,
      },
      context: ErrorName.enum.BAD_REQUEST,
      payload: null,
    });
  }

  if (isResponseSerializationError(error)) {
    // ---

    const zodMessage = parseZodError(error.cause.issues);

    request.log.error(error, `${error.message} ${zodMessage}`);

    return reply.code(400).send({
      message: {
        ...message,
        text: error.message ?? "Response does not match schema validation",
        name: ErrorName.enum.BAD_REQUEST,
        description: `${error.message}. ${zodMessage}`,
      },

      description: zodMessage,

      payload: null,
    });
  }

  const statusCode = Number.parseInt(error?.code ?? "500") || 500;

  if (isJavascriptError(error)) {
    request.log.error(error);

    return reply.status(statusCode).send({
      context: ErrorName.enum.SERVER_ERROR,
      message: {
        ...message,
        name: ErrorName.enum.BAD_REQUEST,
        text: "Something went wrong on our end. We are working to fix this issue. [lng 0]",

        description:
          "Something went wrong on our end. We are working to fix this issue. [lng 0]",
      },

      payload: null,
    });
  }

  if (error instanceof jose.errors.JOSEError) {
    return reply.status(statusCode).send({
      context: ErrorName.enum.AUTHENTICATION_ERROR,
      message: {
        ...message,
        text: "[Authentication] Your session must have expired. Try loging in again [a-0]",

        description: String(error),
        name: ErrorName.enum.AUTHENTICATION_ERROR,
      },

      payload: null,
    });
  }

  if (error instanceof Exception) {
    // console.log('instanceof Exception <<<<<<');

    if (criticalErrors.includes(error.name)) {
      // console.log('<<< critical error >>>>');

      const errorMessage =
        "[Critical] Something went wrong on our end. We are working to fix this issue.[c-0]";

      request.log.info(` critical error > -- ** ${error.name} ** --`);
      request.log.error(error);

      return reply.status(statusCode).send({
        context: ErrorName.enum.SERVER_ERROR,
        message: {
          ...message,
          text: errorMessage,
          name: ErrorName.enum.SERVER_ERROR,
          description: String(error),
        },
        payload: null,
      });
    }

    return reply.status(statusCode).send({
      description: String(error),
      context: error.name,
      message: {
        ...message,
        text: error.message,
        name: error.name,
        description: String(error),
      },
      payload: null,
    });
  }

  request.log.error(error, "random error");
  const errorMessage = error instanceof Error ? error.message : String(error);

  console.log(errorMessage, "random error message");

  const statusCode503 = Number.parseInt(String(error?.code ?? "503")) || 503;

  return reply.status(statusCode503).send({
    message: {
      ...message,
      message: error.message,
      name: error.name || ErrorName.enum.BAD_REQUEST,
      description: String(error),
    },
    context: error.name || ErrorName.enum.BAD_REQUEST,
    payload: null,
  });
}

// --- E
