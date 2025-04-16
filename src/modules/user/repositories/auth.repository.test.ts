import { type Db, MongoClient, ObjectId } from "mongodb";
import { AuthRepository, type iAuthRepository } from "./auth.repository";
import type { AuthentiCredentials } from "../dtos/auth_credentials.dto";

jest.mock("./auth.repository", () => {
  return {
    AuthRepository: jest.fn().mockImplementation(() => {
      return {
        create: () => {
          return ObjectId.createFromTime(1);
        },
        isEmailInUse: () => { },
        getCredentials: () => { },
      };
    }),
  };
});

describe("Authentication Repository", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    console.log({
      env: process.env.MONGO_URL,
      name: process.env.MONGO_DB_NAME,
      global: globalThis.__MONGO_DB_NAME__,
    });
    connection = await MongoClient.connect(process.env.MONGO_URL ?? "", {});
    //
    db = connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("AuthRepository class constructor", () => {
    const authRepo = new AuthRepository({ mongo: db });

    const signUpCredentials: AuthentiCredentials = {
      email: "test@ledger.com",
      password: "!2E456789",
    };

    authRepo.create(signUpCredentials);
    expect(AuthRepository).toHaveBeenCalledTimes(1);
  });

  it("Create new user", async () => {
    const authRepo = new AuthRepository({ mongo: db });

    const signUpCredentials: AuthentiCredentials = {
      email: "test@ledger.com",
      password: "!2E456789",
    };

    const userId = await authRepo.create(signUpCredentials);

    // console.log({ userId });

    expect(ObjectId.isValid(userId)).toBeTruthy();
  });

  it("is email in use", async () => {
    const authRepo = new AuthRepository({ mongo: db });

    const signUpCredentials: AuthentiCredentials = {
      email: "test@ledger.com",
      password: "!2E456789",
    };

    const userId = await authRepo.create(signUpCredentials);

    // console.log({ userId });

    expect(ObjectId.isValid(userId)).toBeTruthy();
  });
});
