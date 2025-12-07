import { AuthResponse, RequestTokenResponse } from "../types";

export class AuthService {
  static async requestToken(
    email: string,
    name?: string,
    eventId?: string,
  ): Promise<RequestTokenResponse> {
    const body: any = { email };
    if (name && eventId) {
      body.name = name;
      body.eventId = eventId;
    }
    const response = await fetch("/api/auth/request-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to request token");
    }
    return response.json();
  }

  static async verifyToken(token: string): Promise<AuthResponse> {
    const response = await fetch("/api/auth/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Invalid token");
    }
    return response.json();
  }
}
