import { Event, Participant } from "../../../../src/lib/types";

export class AdminEventService {
  static async fetchEvents(): Promise<Event[]> {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("/api/admin/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  }

  static async fetchParticipantsForEvent(
    eventId: string,
  ): Promise<Participant[]> {
    const response = await fetch(`/api/admin/participants?eventId=${eventId}`);
    if (!response.ok) throw new Error("Failed to fetch participants");
    const data = await response.json();
    return data.participants;
  }

  static async createEvent(name: string, date: string): Promise<Event> {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("/api/admin/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, date }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create event");
    }
    return response.json();
  }

  static async generateDraw(eventId: string): Promise<void> {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("/api/admin/generate-draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate draw");
    }
    return response.json();
  }

  static async deleteEvent(eventId: string): Promise<void> {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("/api/admin/events", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete event");
    }
  }
}
