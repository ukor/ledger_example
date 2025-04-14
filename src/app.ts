import fastify, {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from "fastify";

import * as path from "node:path";

import AutoLoad from "@fastify/autoload";
import { fastifyErrorHandler } from "./commons/exceptions";
import { AppConfig } from "./configs/index.js";

export function main(opts: Record<string, unknown>): FastifyInstance {
  // ---

  const app = fastify(opts);

  // See - https://fastify.dev/docs/latest/Reference/Hooks/#onerror
  app.addHook(
    "onError",

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (_request: FastifyRequest, _reply: FastifyReply, error: any, done: any) => {
      // ---

      if (error) {
        console.log(error, `--- ${AppConfig.appName} error hooks --- `);
      }

      done();
    },
  );

  // fastify.register(helmet, { global: true });

  app.setErrorHandler(fastifyErrorHandler);

  const pluginsDir = path.resolve(__dirname, "./plugins");

  app.register(AutoLoad, {
    dir: pluginsDir,
    options: {},
  });

  const modulesDir = path.resolve(__dirname, "./modules");

  // This loads all plugins defined in routes
  // define your routes in one of these
  app.register(AutoLoad, {
    dir: modulesDir,
    maxDepth: 5,
    dirNameRoutePrefix: false,
    matchFilter: (filePath: string) => {
      return filePath.endsWith(".route.js") || filePath.endsWith(".route.ts");
    },
    options: {},
  });

  return app;
}
