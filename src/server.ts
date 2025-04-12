import "dotenv/config";

import type { IncomingMessage } from "node:http";
import type { HookHandlerDoneFunction } from "fastify";
import { ObjectId } from "mongodb";
import { main } from "./app";
import { AppConfig } from "./configs";

const server = main({
  pluginTimeout: 90000,
  connectionTimeout: 60000,
  requestTimeout: 60000,

  genReqId: (_request: IncomingMessage) => {
    return new ObjectId().toString("base64");
  },
});

server.addHook("onReady", (done: HookHandlerDoneFunction) => {
  // ---

  console.log("--- STARTING ledger app ---");
  done();
});

server.listen({ port: 3012 }, (error, address) => {
  if (error) {
    server.log.error(error);

    process.exit(1);
  }

  console.log("address => ", address);
});

server.addHook("onListen", (done: HookHandlerDoneFunction) => {
  // ---

  console.log(`---  ${AppConfig.appName} is ready ---`);

  console.log(
    `[ ${AppConfig.appName} ready ] http://127.0.0.1:${AppConfig.port}`,
  );

  console.log(
    `[ ${AppConfig.appName} ready ] http://localhost:${AppConfig.port}`,
  );

  if (process.send) {
    console.log("process.send exist");
    // process.send('ready');
  }

  done();
});

server.addHook("onClose", () => {
  // ---

  process.exit(0);
});
