import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const eventId = formData.get("eventId") as string;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 },
      );
    }

    // Validate that the event exists and belongs to the admin
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.adminId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const csvText = await file.text();
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    if (headers[0] !== "name" || headers[1] !== "email") {
      return NextResponse.json(
        {
          error: "CSV must have 'name' and 'email' headers (email is optional)",
        },
        { status: 400 },
      );
    }

    const participants = lines.slice(1).map((line) => {
      const [name, email] = line.split(",").map((s) => s.trim());
      return { name, email };
    });

    // Validate participants
    for (const p of participants) {
      if (
        !p.name ||
        typeof p.name !== "string" ||
        (p.email && typeof p.email !== "string")
      ) {
        return NextResponse.json(
          { error: "Invalid participant data" },
          { status: 400 },
        );
      }
    }

    // Create participants
    const createdParticipants = await prisma.$transaction(
      participants.map((p) =>
        prisma.participant.create({
          data: {
            id: crypto.randomUUID(),
            name: p.name,
            email: p.email,
            eventId,
          },
        }),
      ),
    );

    return NextResponse.json({ participants: createdParticipants });
  } catch (error) {
    console.error("Error importing participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
