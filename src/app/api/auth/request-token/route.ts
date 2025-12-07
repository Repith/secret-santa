import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { generateToken } from "../../../../../src/lib/auth";
import { sendEmail } from "../../../../../src/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, name, eventId } = await request.json();

    let participant;

    if (email && !name) {
      participant = await prisma.participant.findUnique({
        where: { email },
      });
    } else if (name && eventId) {
      participant = await prisma.participant.findFirst({
        where: { name, eventId },
      });

      if (!participant) {
        return NextResponse.json(
          { error: "Participant not found" },
          { status: 404 },
        );
      }

      if (!participant.email) {
        if (!email) {
          return NextResponse.json(
            { error: "Email address is required for this participant" },
            { status: 400 },
          );
        }

        participant = await prisma.participant.update({
          where: { id: participant.id },
          data: { email },
        });
      } else {
        if (email && participant.email !== email) {
          return NextResponse.json(
            {
              error:
                "Ta osoba ma już przypisany inny adres e-mail. Jeśli to się nie zgadza, skontaktuj się z administratorem.",
            },
            { status: 400 },
          );
        }
      }
    } else {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 },
      );
    }

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    if (participant.email) {
      const token = await generateToken(participant.id);

      await sendEmail({
        to: participant.email,
        subject: "Twój kod logowania do Tajnego Mikołaja",
        body: token,
      });

      return NextResponse.json({ message: "Token sent to email" });
    } else {
      return NextResponse.json(
        { error: "Participant has no email address" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error requesting token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
