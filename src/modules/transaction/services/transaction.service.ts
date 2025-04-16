import { ObjectId } from "mongodb";
import {
  type SendFund,
  type TransactionEntity,
  TransactionType,
} from "../dtos/transaction.dto";
import type { TransactionRepository } from "../repositories/transaction.repository";

export class TransactionService {
  constructor(private readonly txRepo: TransactionRepository) { }

  async send(arg: SendFund, sender: string) {
    // ---

    // check sender balance
    //

    const senderDebit: TransactionEntity = {
      amount: 0 - arg.amount,
      type: TransactionType.enum.debit,
      user: sender,
      currency: "NGN",
      _id: new ObjectId(),
    };

    const recipientCredit: TransactionEntity = {
      amount: arg.amount,
      type: TransactionType.enum.debit,
      user: sender,
      currency: "NGN",
      _id: new ObjectId(),
    };

    const debited = await this.txRepo.registerTransaction([
      recipientCredit,
      senderDebit,
    ]);

    return debited;
  }
}
