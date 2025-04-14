import { type Db, ObjectId } from "mongodb";
import type { Database } from "../../../commons/dtos/database.dto.js";
import { ErrorName } from "../../../commons/dtos/error.dto.js";
import { Exception } from "../../../commons/exceptions/index.js";
import { AppConfig } from "../../../configs/index.js";
import type {
  AuthenticationEntity,
  AuthentiCredentials,
} from "../dtos/auth_credentials.dto.js";
import type { AuthenticationCredentialsEntity } from "../dtos/user.dto.js";

export interface iAuthRepository {
  create: (credentials: AuthentiCredentials) => Promise<ObjectId>;
  isEmailInUse: (email: string) => Promise<boolean>;
  getCredentials: (email: string) => Promise<AuthenticationEntity>;
}

export class AuthRepository implements iAuthRepository {
  private readonly dbInstance: Db;

  private collection = "users";

  constructor(readonly database: Database) {
    this.dbInstance = database.mongo.db(AppConfig.mongoName);
  }

  async create(credentials: AuthentiCredentials): Promise<ObjectId> {
    // ---

    const { acknowledged, insertedId } = await this.dbInstance
      .collection<AuthenticationCredentialsEntity>(this.collection)
      .insertOne({
        _id: new ObjectId(),
        authCredentials: {
          email: credentials.email,
          password: credentials.password,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (acknowledged === false) {
      throw new Exception(
        ErrorName.enum.DATABASE_ERROR,
        "Could not finish signing up process. Try again later",
        "Could not write to database",
      );
    }

    return insertedId;
  }

  async isEmailInUse(email: string): Promise<boolean> {
    // ---

    const count = await this.dbInstance
      .collection<AuthenticationCredentialsEntity>(this.collection)
      .countDocuments({ "authCredentials.email": email });

    return count > 0;
  }

  async getCredentials(email: string): Promise<AuthenticationEntity> {
    // ---

    const credentials = await this.dbInstance
      .collection<AuthenticationCredentialsEntity>(this.collection)
      .findOne({ "authCredentials.email": email });

    if (credentials === null) {
      throw new Exception(
        ErrorName.enum.AUTHENTICATION_ERROR,
        "Invalid authentication details",
        "No user is associated with the provided email address",
      );
    }

    return { _id: credentials._id, ...credentials.authCredentials };
  }
}
