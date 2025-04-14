import type { MongoClient } from "mongodb";

export interface Database {
  mongo: MongoClient;
}
