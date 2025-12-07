import { prisma } from "./prisma";
import { Participant } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function generateToken(participantId: string): Promise<string> {
  const token = Math.floor(Math.random() * 900000 + 100000).toString();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.loginToken.create({
    data: {
      id: token,
      token,
      participantId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyToken(
  token: string,
): Promise<{ valid: boolean; participant?: Participant }> {
  const loginToken = await prisma.loginToken.findUnique({
    where: { token },
    include: { participant: true },
  });

  if (!loginToken || loginToken.expiresAt < new Date()) {
    return { valid: false };
  }

  return { valid: true, participant: loginToken.participant };
}

export function generateJWT(payload: {
  adminId: string;
  username: string;
}): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET not set");
  }
  return jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
}

export function verifyJWT(
  token: string,
): { adminId: string; username: string } | null {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      adminId: string;
      username: string;
    };
    return decoded;
  } catch {
    return null;
  }
}
