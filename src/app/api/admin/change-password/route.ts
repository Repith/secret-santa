import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

import { hashPassword, verifyPassword } from "@/lib/bcrypt";
import {
  AdminChangePasswordRequest,
  AdminChangePasswordResponse,
} from "@/lib/types";
import { Admin } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyJWT(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminId, username } = payload;

    const body: AdminChangePasswordRequest = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      console.log(
        `[${new Date().toISOString()}] Password change attempt failed: missing fields, admin=${username}`,
      );
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 },
      );
    }

    const admin: Admin | null = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      console.log(
        `[${new Date().toISOString()}] Password change attempt failed: admin not found, adminId=${adminId}`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isValid = await verifyPassword(currentPassword, admin.password_hash);

    if (!isValid) {
      console.log(
        `[${new Date().toISOString()}] Password change attempt failed: invalid current password, admin=${username}`,
      );
      return NextResponse.json(
        { error: "Invalid current password" },
        { status: 400 },
      );
    }

    const newHash = await hashPassword(newPassword);

    await prisma.admin.update({
      where: { id: adminId },
      data: { password_hash: newHash },
    });

    console.log(
      `[${new Date().toISOString()}] Password change successful: admin=${username}`,
    );

    const response: AdminChangePasswordResponse = {
      success: true,
      message: "Password changed successfully",
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
