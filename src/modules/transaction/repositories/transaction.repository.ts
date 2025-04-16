import { ObjectId, type Db } from "mongodb";

import type { Database } from "../../../commons/dtos/database.dto";
import { AppConfig } from "../../../configs";
import type { TransactionEntity } from "../dtos/transaction.dto";
import { Exception } from "../../../commons/exceptions";
import { ErrorName } from "../../../commons/dtos/error.dto";

export class TransactionRepository {
  private readonly dbInstance: Db;

  private collection = "transactions";

  constructor(readonly database: Database) {
    this.dbInstance = database.mongo.db(AppConfig.mongoName);
  }

  async registerTransaction(tx: TransactionEntity[]) {
    // ---

    const { acknowledged } = await this.dbInstance
      .collection<TransactionEntity>(this.collection)
      .insertMany(tx);

    if (acknowledged === false) {
      throw new Exception(
        ErrorName.enum.DATABASE_ERROR,
        "Could not finish signing up process. Try again later",
        "Could not write to database",
      );
    }

    return acknowledged;
  }

  async getTransactions(email: string): Promise<TransactionEntity[]> {
    // ---

    const txs = await this.dbInstance
      .collection<TransactionEntity>(this.collection)
      .find({
        user: email,
      })
      .toArray();

    return txs;
  }
}
