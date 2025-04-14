import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import fMongo from "@fastify/mongodb";
import { AppConfig } from "../configs";

export default fp(async (fastify: FastifyInstance) => {
  // ---

  const primaryURI = `mongodb://${AppConfig.mongoUserName}:${AppConfig.mongoPassword}@${AppConfig.mongoHost}`;

  // ${AppConfig.mongoName}`;

  console.log(primaryURI);

  fastify.register(fMongo, {
    forceClose: true,
    name: "primary",
    url: primaryURI,
    database: AppConfig.mongoName,
  });
});
