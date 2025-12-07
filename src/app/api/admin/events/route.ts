import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import {
  CreateEventRequest,
  DeleteEventRequest,
  DeleteEventResponse,
} from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminId = decoded.adminId;

    const events = await prisma.event.findMany({
      where: { adminId },
      include: {
        draws: {
          include: {
            giver: true,
            receiver: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminId = decoded.adminId;

    const body: CreateEventRequest = await request.json();
    const { name, date } = body;

    if (!name || !date) {
      return NextResponse.json(
        { error: "Name and date are required" },
        { status: 400 },
      );
    }

    // Validate date is a valid future date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }
    const now = new Date();
    if (eventDate <= now) {
      return NextResponse.json(
        { error: "Event date must be in the future" },
        { status: 400 },
      );
    }

    const event = await prisma.event.create({
      data: {
        id: randomUUID(),
        name,
        date: eventDate,
        adminId,
      },
      include: {
        participants: true,
        draws: {
          include: {
            giver: true,
            receiver: true,
          },
        },
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminId = decoded.adminId;

    const body: DeleteEventRequest = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 },
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event || event.adminId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    const response: DeleteEventResponse = { success: true };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
