import { z } from "zod";
import { AuthentiCredentials } from "./auth_credentials.dto.js";
import { ObjectId } from "mongodb";

export const AuthenticationCredentialsEntity = z.object({
  authCredentials: AuthentiCredentials,
  _id: z.instanceof(ObjectId),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type AuthenticationCredentialsEntity = z.infer<
  typeof AuthenticationCredentialsEntity
>;
