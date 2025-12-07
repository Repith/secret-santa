import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "../../../../../src/lib/prisma";
import { verifyJWT } from "../../../../../src/lib/auth";
import { CreateParticipantRequest } from "@/lib/types";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const whereClause: Prisma.ParticipantWhereInput = { event: { adminId } };
    if (eventId) {
      whereClause.eventId = eventId;
    }

    const participants = await prisma.participant.findMany({
      where: whereClause,
      include: {
        event: true,
        loginTokens: true,
        wanted: true,
        unwanted: true,
        exclusionsGiven: true,
        exclusionsReceived: true,
      },
    });

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("Error fetching participants:", error);
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

    const body: CreateParticipantRequest = await request.json();
    const { name, email, wantedHints, unwantedHints, eventId } = body;

    if (!name || !eventId) {
      return NextResponse.json(
        { error: "Name and eventId are required" },
        { status: 400 },
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event || event.adminId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participantId = randomUUID();

    const participant = await prisma.participant.create({
      data: {
        id: participantId,
        name,
        email,
        eventId,
        wanted: {
          create: (wantedHints || []).map((hint: string) => ({
            id: randomUUID(),
            hint,
          })),
        },
        unwanted: {
          create: (unwantedHints || []).map((hint: string) => ({
            id: randomUUID(),
            hint,
          })),
        },
      },
      include: {
        event: true,
        wanted: true,
        unwanted: true,
      },
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error("Error creating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
