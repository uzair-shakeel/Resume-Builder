import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";

// POST - Reset user password (accessible to everyone)
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Find user to update
    const userToUpdate = await User.findById(params.id);
    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a random temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex");

    // Update user with temporary password
    userToUpdate.password = tempPassword;
    userToUpdate.updatedAt = new Date();
    await userToUpdate.save();

    // In a real application, we would send an email with the temporary password
    // For this example, we'll just return it in the response
    // In production, you should implement a proper password reset email system

    return NextResponse.json({
      message: "Password reset successfully",
      // WARNING: In a real application, DO NOT return the password in the response
      // This is for demonstration purposes only
      tempPassword: tempPassword,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
