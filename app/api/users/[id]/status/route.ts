import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// PATCH - Change user status (accessible to everyone)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Parse request body
    const { status } = await req.json();

    // Validate status
    if (!status || !["active", "inactive", "suspended"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    // Find user to update
    const userToUpdate = await User.findById(params.id);
    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user status
    userToUpdate.status = status;
    userToUpdate.updatedAt = new Date();
    await userToUpdate.save();

    // Return updated user
    return NextResponse.json({
      id: userToUpdate._id,
      status: userToUpdate.status,
      updatedAt: userToUpdate.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
