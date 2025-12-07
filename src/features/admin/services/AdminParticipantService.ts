import { Participant } from "../../../../src/lib/types";

export class AdminParticipantService {
  static async fetchParticipants(eventId?: string): Promise<Participant[]> {
    const token = localStorage.getItem("adminToken");
    const url = eventId
      ? `/api/admin/participants?eventId=${eventId}`
      : "/api/admin/participants";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch participants");
    const data = await response.json();
    return data.participants;
  }

  static async importParticipants(
    eventId: string,
    file: File,
  ): Promise<{ participants: Participant[] }> {
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", eventId);

    const response = await fetch("/api/admin/participants/import", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to import participants");
    }
    return response.json();
  }

  static async addParticipant(
    eventId: string,
    name: string,
    email: string | undefined,
    wantedHints: string[] | undefined,
    unwantedHints: string[] | undefined,
  ): Promise<Participant> {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("/api/admin/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId,
        name,
        email,
        wantedHints,
        unwantedHints,
      }),
    });
    if (!response.ok) throw new Error("Failed to add participant");
    const data = await response.json();
    return data.participant;
  }

  static async updateParticipant(
    participantId: string,
    email: string | null,
    wantedHints: string[],
    unwantedHints: string[],
  ): Promise<Participant> {
    const token = localStorage.getItem("adminToken");
    const body: {
      wantedHints: string[];
      unwantedHints: string[];
      email?: string;
    } = { wantedHints, unwantedHints };
    if (email !== null) body.email = email;
    const response = await fetch(`/api/admin/participants/${participantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update participant");
    }
    const data = await response.json();
    return data.participant;
  }

  static async deleteParticipant(participantId: string): Promise<void> {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`/api/admin/participants/${participantId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete participant");
    }
    return response.json();
  }

  static async uploadAvatar(
    participantId: string,
    file: File,
  ): Promise<{ message: string }> {
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await fetch(
      `/api/admin/participants/${participantId}/avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload avatar");
    }
    return response.json();
  }

  static async fetchExclusions(
    participantId: string,
  ): Promise<{ excludedIds: string[] }> {
    const response = await fetch(
      `/api/participants/${participantId}/exclusions`,
    );
    if (!response.ok) throw new Error("Failed to fetch exclusions");
    return response.json();
  }

  static async updateExclusions(
    participantId: string,
    excludedIds: string[],
  ): Promise<void> {
    const response = await fetch(
      `/api/participants/${participantId}/exclusions`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludedIds }),
      },
    );
    if (!response.ok) throw new Error("Failed to update exclusions");
    return response.json();
  }
}
