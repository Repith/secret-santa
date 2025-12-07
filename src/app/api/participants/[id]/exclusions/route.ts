import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { excludedIds } = await request.json();
    const { id: participantId } = await params;

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 },
      );
    }

    // Get the participant's event
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      select: { eventId: true },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    const eventId = participant.eventId;

    // Validate that all excludedIds are participants in the same event and not the participant himself
    if (excludedIds && excludedIds.length > 0) {
      const validParticipants = await prisma.participant.findMany({
        where: {
          id: { in: excludedIds },
          eventId,
        },
        select: { id: true },
      });

      const validIds = validParticipants.map((p: { id: string }) => p.id);
      const invalidIds = excludedIds.filter(
        (id: string) => !validIds.includes(id) || id === participantId,
      );

      if (invalidIds.length > 0) {
        return NextResponse.json(
          {
            error:
              "Invalid exclusions: participants must be in the same event and not yourself",
          },
          { status: 400 },
        );
      }
    }

    // Delete existing exclusions
    await prisma.exclusion.deleteMany({
      where: { giverId: participantId },
    });

    // Create new exclusions
    if (excludedIds && excludedIds.length > 0) {
      const exclusions = excludedIds.map((excludedId: string) => ({
        giverId: participantId,
        excludedId,
      }));
      await prisma.exclusion.createMany({
        data: exclusions,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving exclusions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: participantId } = await params;

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 },
      );
    }

    const exclusions = await prisma.exclusion.findMany({
      where: { giverId: participantId },
      select: { excludedId: true },
    });

    const excludedIds = exclusions.map(
      (e: { excludedId: string }) => e.excludedId,
    );

    return NextResponse.json({ excludedIds });
  } catch (error) {
    console.error("Error fetching exclusions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
