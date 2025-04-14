// require("dotenv").config();

const env = process.env;

export type AppConfig = {
  port: string;
  appName: string;
  mongoName: string;
  mongoHost: string;
  mongoUserName: string;
  mongoPassword: string;
  jwtSecret: string;
  jwtAlgorithm: string | "HS256" | "HS512";
};

export const AppConfig: AppConfig = {
  port: env?.port ?? "3012",
  appName: "ledger",
  mongoName: env?.MONGO_NAME ?? "",
  mongoHost: env?.MONGO_HOST ?? "",
  mongoUserName: env?.MONGO_USER ?? "",
  mongoPassword: env?.MONGO_PASSWORD ?? "",
  jwtSecret: env?.JWT_SECRET ?? "",
  jwtAlgorithm: env?.JWT_ALGORITHM ?? "HS256",
};
