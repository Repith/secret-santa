import { DrawResult, SimpleEvent } from "@/shared/types";

export class EventService {
  static async fetchEvent(eventId: string): Promise<SimpleEvent> {
    const response = await fetch(`/api/events/${eventId}`);
    if (!response.ok) {
      throw new Error("Event not found");
    }
    return response.json();
  }

  static async fetchHasDraws(eventId: string): Promise<boolean> {
    const response = await fetch(`/api/events/${eventId}`);
    if (!response.ok) {
      throw new Error("Event not found");
    }
    const data = await response.json();
    return data.hasDraws;
  }

  static async getDrawResult(token: string): Promise<DrawResult> {
    const response = await fetch("/api/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get draw result");
    }
    return response.json();
  }

  static async checkDrawStatus(
    token: string,
    eventId: string,
    participantId: string,
  ): Promise<{
    eventHasDraws: boolean;
    participantHasDrawn: boolean;
    drawResult?: DrawResult;
  }> {
    const eventResponse = await fetch(`/api/events/${eventId}`);
    if (!eventResponse.ok) {
      throw new Error("Failed to fetch event");
    }

    const eventData = await eventResponse.json();
    const eventHasDraws = Boolean(eventData.hasDraws);

    const participant = eventData.participants?.find(
      (p: { id: string }) => p.id === participantId,
    );

    const participantHasDrawn = Boolean(participant?.hasDrawn);

    if (!eventHasDraws) {
      return {
        eventHasDraws: false,
        participantHasDrawn: false,
      };
    }

    if (!participantHasDrawn) {
      return {
        eventHasDraws: true,
        participantHasDrawn: false,
      };
    }

    const response = await fetch("/api/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          eventHasDraws: true,
          participantHasDrawn: false,
        };
      }
      throw new Error("Failed to check draw status");
    }

    const data = await response.json();
    return {
      eventHasDraws: true,
      participantHasDrawn: true,
      drawResult: data,
    };
  }

  static async markGiftRevealed(token: string, eventId: string) {
    const response = await fetch("/api/draw/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, eventId }),
    });

    if (!response.ok) {
      throw new Error("Failed to mark gift as revealed");
    }
  }

  static async fetchParticipants(
    eventUuid: string,
  ): Promise<{ id: string; name: string; email: string }[]> {
    const response = await fetch(`/api/events/${eventUuid}/participants`);
    if (!response.ok) {
      throw new Error("Failed to fetch participants");
    }
    return response.json();
  }
}
