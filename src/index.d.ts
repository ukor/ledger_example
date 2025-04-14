import type { AuthenticatedUser } from "./commons/dtos/authenticated_user.dto";

export * from "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    authenticatedUser: AuthenticatedUser | null;
  }
}
