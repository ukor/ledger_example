import fastify, { type FastifyInstance } from "fastify";

export function main(opts: Record<string, unknown>): FastifyInstance {
  // ---

  const app = fastify(opts);

  // register

  return app;
}
