import { AuthService } from "../../../shared/services/AuthService";
import { AuthResponse, RequestTokenResponse } from "../../../shared/types";

export class LoginService {
  static async requestToken(
    email: string,
    name?: string,
    eventId?: string,
  ): Promise<RequestTokenResponse> {
    return AuthService.requestToken(email, name, eventId);
  }

  static async verifyToken(token: string): Promise<AuthResponse> {
    return AuthService.verifyToken(token);
  }
}
