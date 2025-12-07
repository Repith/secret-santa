import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyJWT } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(
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

    // Check if participant exists and belongs to admin
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!participant || participant.event.adminId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No avatar file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
        },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 },
      );
    }

    // Get file extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";

    // Create avatars directory if it doesn't exist
    const avatarsDir = join(process.cwd(), "public", "avatars");
    await mkdir(avatarsDir, { recursive: true });

    // Save file
    const fileName = `${id}.${ext}`;
    const filePath = join(avatarsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update participant
    const avatarPath = `/avatars/${fileName}`;
    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: { avatar: avatarPath },
      include: {
        event: true,
        loginTokens: true,
      },
    });

    return NextResponse.json({ participant: updatedParticipant });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
