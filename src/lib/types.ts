// TypeScript interfaces and types for the Secret Santa application

export interface Event {
  id: string;
  name: string;
  date: Date;
  adminId: string;
  admin: Admin;
  participants: Participant[];
  draws: Draw[];
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  events: Event[];
}

export interface WantedHint {
  id: string;
  participantId: string;
  hint: string;
}

export interface UnwantedHint {
  id: string;
  participantId: string;
  hint: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string | null;
  wanted: WantedHint[];
  unwanted: UnwantedHint[];
  hasDrawn: boolean;
  avatar: string | null;
  eventId: string;
  event: Event;
  loginTokens: LoginToken[];
  exclusionsGiven: Exclusion[];
  exclusionsReceived: Exclusion[];
}

export interface LoginToken {
  id: string;
  token: string;
  participantId: string;
  participant: Participant;
  expiresAt: Date;
}

export interface Draw {
  id: string;
  eventId: string;
  event: Event;
  giverId: string;
  giver: Participant;
  receiverId: string;
  receiver: Participant;
  createdAt: Date;
}

export interface Exclusion {
  id: string;
  giverId: string;
  giver: Participant;
  excludedId: string;
  excluded: Participant;
}

// Additional types for API requests and responses

// For importing participants from JSON
export interface ImportParticipant {
  name: string;
  email: string | null;
}

// Response for admin statistics
export interface AdminStats {
  totalEvents: number;
  totalParticipants: number;
  totalLoginTokens: number;
}

// Response for verifying authentication token
export interface VerifyTokenResponse {
  valid: boolean;
  participant?: Participant;
}

// Admin API types
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}

export interface AdminChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface CreateEventRequest {
  name: string;
  date: string; // ISO date string
}

export interface CreateEventResponse {
  id: string;
  name: string;
  date: string;
  adminId: string;
}

export interface UpdateEventRequest {
  name?: string;
  date?: string;
}

export interface GenerateDrawRequest {
  eventId: string;
}

export interface GenerateDrawResponse {
  success: boolean;
  message: string;
  drawsGenerated: number;
}

export interface CreateParticipantRequest {
  name: string;
  email?: string;
  avatar?: string;
  wantedHints?: string[];
  unwantedHints?: string[];
  eventId: string;
}

export interface UpdateParticipantRequest {
  name?: string;
  email?: string;
  avatar?: string;
  wantedHints?: string[];
  unwantedHints?: string[];
}

export interface ImportParticipantsRequest {
  participants: Array<{
    name: string;
    email?: string;
  }>;
}

export interface ImportParticipantsResponse {
  success: boolean;
  imported: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export interface AdminStatsResponse {
  totalEvents: number;
  totalParticipants: number;
  totalLoginTokens: number;
  eventsWithDraws: number;
  participantsWithDraws: number;
}

export interface DeleteEventRequest {
  eventId: string;
}

export interface DeleteEventResponse {
  success: boolean;
}

export interface GetParticipantsResponse {
  participants: Participant[];
}

export interface CreateParticipantResponse {
  participant: Participant;
}
