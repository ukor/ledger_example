require("dotenv").config();

const env = process.env;

export type AppConfig = {
  port: string;
  appName: string;
  databaseName: string;
  databaseHost: string;
  databaseUserName: string;
  databasePassword: string;
};

export const AppConfig: AppConfig = {
  port: env?.port ?? "3012",
  appName: "ledger",
  databaseName: env?.databaseName ?? "",
  databaseHost: env?.databaseHost ?? "",
  databaseUserName: env?.databaseUserName ?? "",
  databasePassword: env?.databasePassword ?? "",
};
