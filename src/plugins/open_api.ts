import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { AppConfig } from "../configs";

export default fp(async (fastify: FastifyInstance) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Ledger API Specifications",
        description: "Api Specifications for ledger backend service",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${AppConfig.port}`,
          description: "Local environment base URL",
        },
        {
          url: "https://DO-NOT-DO-THAT.ledger.com.ng",
          description: "Production environment base URL",
        },
        {
          url: "https://api-stg.ledger.com.ng",
          description: "Staging environment base URL",
        },
        {
          url: "https://api-dev.ledger.com.ng",
          description: "Development environment base URL",
        },
      ],
      components: {
        securitySchemes: {
          jwt: {
            type: "apiKey",
            name: "x-api-key",
            in: "header",
          },
          role: {
            type: "apiKey",
            name: "x-role",
            in: "header",
          },
          uid: {
            type: "apiKey",
            name: "x-uid",
            in: "header",
          },
          did: {
            type: "apiKey",
            name: "x-did",
            in: "header",
          },
          deprecatedHost: {
            type: "apiKey",
            name: "x-deprecated-host",
            in: "header",
          },
          oldPath: {
            type: "apiKey",
            name: "x-old-request-uri",
            in: "header",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  fastify.register(fastifySwaggerUI, {
    routePrefix: "/__api-docs",
    uiConfig: {
      layout: "StandaloneLayout",
      tryItOutEnabled: false,
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      deepLinking: true,
    },
  });
});
