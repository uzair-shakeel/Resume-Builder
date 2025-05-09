import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// PATCH - Change user role (accessible to everyone)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Parse request body
    const { role } = await req.json();

    // Validate role
    if (!role || !["admin", "user"].includes(role)) {
      return NextResponse.json(
        { error: "Valid role is required" },
        { status: 400 }
      );
    }

    // Find user to update
    const userToUpdate = await User.findById(params.id);
    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user role
    userToUpdate.role = role;
    userToUpdate.updatedAt = new Date();
    await userToUpdate.save();

    // Return updated user
    return NextResponse.json({
      id: userToUpdate._id,
      role: userToUpdate.role,
      updatedAt: userToUpdate.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
