import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const result = await verifyToken(token);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
