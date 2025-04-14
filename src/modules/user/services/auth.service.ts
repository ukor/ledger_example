import { ErrorName } from "../../../commons/dtos/error.dto.js";
import { ResponseMessageType } from "../../../commons/dtos/response_message.dto.js";
import { Exception } from "../../../commons/exceptions/index.js";
import { AppConfig } from "../../../configs/index.js";
import type {
  AuthenticationResponsePayloadWithMessage,
  AuthentiCredentials,
  LoginCredentials,
  SignUpCredentials,
} from "../dtos/auth_credentials.dto.js";
import type { iAuthRepository } from "../repositories/auth.repository.js";
import * as argon from "argon2";
import * as jose from "jose";

export interface iAuthService {
  signUp: (
    arg: SignUpCredentials,
  ) => Promise<AuthenticationResponsePayloadWithMessage>;
  login: (
    arg: SignUpCredentials,
  ) => Promise<AuthenticationResponsePayloadWithMessage>;
}

export class AuthService implements iAuthService {
  constructor(private readonly authRepo: iAuthRepository) { }

  async signUp(
    arg: SignUpCredentials,
  ): Promise<AuthenticationResponsePayloadWithMessage> {
    // ---

    if (arg.confirmPassword.trim() !== arg.password.trim()) {
      throw new Exception(ErrorName.enum.USER_ERROR, "Password does not match");
    }

    const credentials: AuthentiCredentials = {
      email: arg.email.toLowerCase().trim(),
      password: arg.confirmPassword,
    };

    const isEmailInUSe = await this.authRepo.isEmailInUse(arg.email);

    if (isEmailInUSe === false) {
      throw new Exception(
        ErrorName.enum.AUTHENTICATION_ERROR,
        "Email is already in use by another user",
      );
    }

    credentials.password = await argon.hash(credentials.password);

    const userId = await this.authRepo.create(credentials);

    const token = await this.generateJwt(userId.toString());

    return {
      message: {
        type: ResponseMessageType.enum.info,
        text: "Signup successfull",
        name: "ok",
        details: "",
      },
      payload: {
        token,
        uid: userId.toString(),
      },
    };
  }

  private async generateJwt(userId: string): Promise<string> {
    // ---

    const secret = new TextEncoder().encode(AppConfig.jwtSecret);

    const token = await new jose.SignJWT({
      "urn:ledger:claim": true,

      u: userId,
      r: "user",
      s: "",
      d: "",
      f: "authorization",
    })
      .setProtectedHeader({ alg: AppConfig.jwtAlgorithm })
      .setIssuedAt()
      .setIssuer("urn:ledger")
      .setAudience(`urn:user:${userId}`)
      .setExpirationTime("30 minutes")
      .sign(secret);

    return token;
  }

  async login(
    arg: LoginCredentials,
  ): Promise<AuthenticationResponsePayloadWithMessage> {
    // ---

    const email = arg.email.toLowerCase().trim();

    const credentials = await this.authRepo.getCredentials(email);

    const isValidPassword = await argon.verify(
      credentials.password,
      arg.password,
    );

    if (isValidPassword === false) {
      throw new Exception(
        ErrorName.enum.AUTHENTICATION_ERROR,
        "Invalid authentication credentials",
      );
    }

    const token = await this.generateJwt(credentials._id.toString());

    return {
      message: {
        type: ResponseMessageType.enum.info,
        name: "ok",
        text: "Login successfull",
        details: "",
      },
      payload: { token, uid: credentials._id.toString() },
    };
  }
}
