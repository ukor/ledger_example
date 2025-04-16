import { ObjectId } from "mongodb";
import { z } from "zod";

export const SendFund = z.object({
  recipient: z.string().email(),

  amount: z.number().positive(),
});

export type SendFund = z.infer<typeof SendFund>;

export const TransactionType = z.enum(["debit", "credit"]);

export type TransactionType = z.infer<typeof TransactionType>;

export const Transaction = z.object({
  user: z.string().email(),

  type: TransactionType,

  amount: z.number(),

  currency: z.string().min(3).toLowerCase().trim().default("ngn"),
});

export type Transaction = z.infer<typeof Transaction>;

export const TransactionEntity = Transaction.extend({
  _id: z.instanceof(ObjectId),
});

export type TransactionEntity = z.infer<typeof TransactionEntity>;
