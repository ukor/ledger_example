import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {
  HttpErrorResponseDto,
  HttpResponseDto,
} from "../../../commons/dtos/http_response.dto";

export default async function(fastify: FastifyInstance) {
  // ---

  fastify.after(() => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
      method: "POST",
      url: "/a/v1/send",
      schema: {
        security: [{ jwt: [], uid: [], role: [], did: [] }],
        body: z.any(),
        description: "Allow authenticated user send fund",
        tags: ["example"],
        response: {
          "2xx": HttpResponseDto,
          "3xx": HttpErrorResponseDto,
          "4xx": HttpErrorResponseDto,
          "5xx": HttpErrorResponseDto,
        },
      },

      handler: async (
        request: FastifyRequest<{ Body: unknown; }>,
        reply: FastifyReply,
      ) => {
        /// ---

        reply.status(200).send({
          message: "",
          description: "",
          payload: request.body,
          isError: false,
        });
      },
    });
  });
}
