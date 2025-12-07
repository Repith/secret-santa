import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import { UpdateParticipantRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const body: UpdateParticipantRequest = await request.json();
    const { email, wantedHints, unwantedHints } = body;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 },
      );
    }

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!participant || participant.event.adminId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: { email?: string } = {};
    if (email !== undefined) data.email = email;

    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: {
        ...data,
        wanted: {
          deleteMany: {},
          create: (wantedHints || []).map((hint: string) => ({
            id: randomUUID(),
            hint,
          })),
        },
        unwanted: {
          deleteMany: {},
          create: (unwantedHints || []).map((hint: string) => ({
            id: randomUUID(),
            hint,
          })),
        },
      },
      include: {
        event: true,
        loginTokens: true,
        wanted: true,
        unwanted: true,
      },
    });

    return NextResponse.json({ participant: updatedParticipant });
  } catch (error) {
    console.error("Error updating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 },
      );
    }

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!participant || participant.event.adminId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
