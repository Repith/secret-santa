import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../src/lib/auth";
import { prisma } from "../../../../../src/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const verification = await verifyToken(token);

    if (!verification.valid || !verification.participant) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const participant = verification.participant;

    await prisma.participant.update({
      where: { id: participant.id },
      data: { hasDrawn: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking gift as revealed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
