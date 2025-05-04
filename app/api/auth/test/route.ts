import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Test connection by counting users
    const userCount = await User.countDocuments({});

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      userCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
