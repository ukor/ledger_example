import z from "zod";
import { ResponseMessage } from "../../../commons/dtos/response_message.dto";
import { HttpResponseDto } from "../../../commons/dtos/http_response.dto";
import { ObjectId } from "mongodb";

export const AuthentiCredentials = z.object({
  email: z.string().email().trim().toLowerCase(),

  password: z.string(),
});

export type AuthentiCredentials = z.infer<typeof AuthentiCredentials>;

export const LoginCredentials = AuthentiCredentials.extend({});

export type LoginCredentials = z.infer<typeof LoginCredentials>;

export const AuthenticationEntity = AuthentiCredentials.extend({
  _id: z.instanceof(ObjectId),
});

export type AuthenticationEntity = z.infer<typeof AuthenticationEntity>;

export const SignUpCredentials = AuthentiCredentials.extend({
  confirmPassword: z.string().min(6),
});

export type SignUpCredentials = z.infer<typeof SignUpCredentials>;

export const AuthenticationResponsePayload = z.object({
  token: z.string().jwt(),
  uid: z.string().min(24),
});

export type AuthenticationResponsePayload = z.infer<
  typeof AuthenticationResponsePayload
>;

export const AuthenticationResponsePayloadWithMessage = z.object({
  message: ResponseMessage.nullable().default(null),

  payload: AuthenticationResponsePayload,
});

export type AuthenticationResponsePayloadWithMessage = z.infer<
  typeof AuthenticationResponsePayloadWithMessage
>;

export const AuthenticationResponse = HttpResponseDto.extend({
  payload: AuthenticationResponsePayload,
});

export type AuthenticationResponse = z.infer<typeof AuthenticationResponse>;
