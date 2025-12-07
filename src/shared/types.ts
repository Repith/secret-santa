// Shared types for UI components and hooks

export interface DrawResult {
  receiver: string;
  avatar?: string;
  giftIdeas: string[];
  dontBuy: string[];
}

export interface SimpleParticipant {
  id: string;
  name: string;
  email: string;
}

export interface SimpleEvent {
  id: string;
  name: string;
  participants: SimpleParticipant[];
  hasDraws: boolean;
}

export interface AuthResponse {
  valid: boolean;
  participant?: SimpleParticipant;
}

export interface RequestTokenResponse {
  success: boolean;
  message?: string;
}
