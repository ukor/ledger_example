import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  HttpErrorResponseDto,
  HttpResponseDto,
} from "../../../commons/dtos/http_response.dto";
import { SignUpCredentials } from "../dtos/auth_credentials.dto";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";

export default async function(fastify: FastifyInstance) {
  // ---

  const authRepo = new AuthRepository({ mongo: fastify.mongo.client });

  fastify.after(() => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
      method: "POST",
      url: "/n/v1/sign_up",
      schema: {
        security: [{ jwt: [], uid: [], role: [], did: [] }],
        body: SignUpCredentials,
        description: "Allows user join the ledger network",
        tags: ["autheentication"],
        response: {
          "2xx": HttpResponseDto,
          "3xx": HttpErrorResponseDto,
          "4xx": HttpErrorResponseDto,
          "5xx": HttpErrorResponseDto,
        },
      },

      handler: async (
        request: FastifyRequest<{ Body: SignUpCredentials; }>,
        reply: FastifyReply,
      ) => {
        /// ---

        const authService = new AuthService(authRepo);

        const r = await authService.signUp(request.body);

        reply.status(200).send({
          message: r.message,
          constext: "ok",
          payload: r.payload,
        });
      },
    });
  });
}
