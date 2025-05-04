import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? "Set ✅" : "Missing ❌",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set ✅" : "Missing ❌",
      NODE_ENV: process.env.NODE_ENV || "Not specified",
    },
  });
}
