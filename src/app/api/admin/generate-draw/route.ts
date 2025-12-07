import { NextRequest, NextResponse } from "next/server";
import { generateDraw } from "../../../../../src/lib/draw";
import { prisma } from "../../../../../src/lib/prisma";
import { verifyJWT } from "../../../../../src/lib/auth";
import { GenerateDrawRequest, GenerateDrawResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const body: GenerateDrawRequest = await request.json();
    const { eventId } = body;

    if (!eventId || typeof eventId !== "string") {
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

    const assignments = await generateDraw(eventId);

    console.log(
      `Generated ${assignments.length} draw assignments for event ${eventId}`,
    );

    // Clear any existing draws for the event
    await prisma.draw.deleteMany({
      where: { eventId },
    });

    // Create new Draw records
    await prisma.$transaction(
      assignments.map((assignment) =>
        prisma.draw.create({
          data: {
            id: crypto.randomUUID(),
            eventId,
            giverId: assignment.giverId,
            receiverId: assignment.receiverId,
          },
        }),
      ),
    );

    const response: GenerateDrawResponse = {
      success: true,
      message: "Draw generated successfully",
      drawsGenerated: assignments.length,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating draw:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
