import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../src/lib/auth";
import { prisma } from "../../../../src/lib/prisma";

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

    const draw = await prisma.draw.findFirst({
      where: {
        eventId: participant.eventId,
        giverId: participant.id,
      },
      include: {
        receiver: { include: { wanted: true, unwanted: true } },
        event: true,
      },
    });

    if (!draw) {
      return NextResponse.json(
        { error: "Draw not generated yet" },
        { status: 404 },
      );
    }

    // Use receiver's wanted hints if available
    const giftIdeas = draw.receiver.wanted
      ? draw.receiver.wanted.map((hint) => hint.hint)
      : [];

    const dontBuy = draw.receiver.unwanted
      ? draw.receiver.unwanted.map((hint) => hint.hint)
      : [];

    return NextResponse.json({
      receiver: draw.receiver.name,
      avatar: draw.receiver.avatar,
      giftIdeas,
      dontBuy,
    });
  } catch (error) {
    console.error("Error getting draw result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
