import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { AdminStatsResponse } from "@/lib/types";

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

    const [
      totalEvents,
      totalParticipants,
      totalLoginTokens,
      eventsWithDraws,
      participantsWithDraws,
    ] = await Promise.all([
      prisma.event.count({ where: { adminId } }),
      prisma.participant.count({ where: { event: { adminId } } }),
      prisma.loginToken.count({
        where: { participant: { event: { adminId } } },
      }),
      prisma.event.count({ where: { adminId, draws: { some: {} } } }),
      prisma.participant.count({
        where: { event: { adminId }, hasDrawn: true },
      }),
    ]);

    const response: AdminStatsResponse = {
      totalEvents,
      totalParticipants,
      totalLoginTokens,
      eventsWithDraws,
      participantsWithDraws,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
