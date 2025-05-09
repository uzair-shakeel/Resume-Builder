import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// GET - Fetch a single user by ID (accessible to everyone)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Find user by ID
    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT - Update a user (accessible to everyone)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Parse request body
    const updateData = await req.json();
    const { name, email, role, status, password } = updateData;

    // Find user to update
    const userToUpdate = await User.findById(params.id);
    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent users from changing email if it already exists
    if (email && email !== userToUpdate.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Update user fields
    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;
    if (role) userToUpdate.role = role;
    if (status) userToUpdate.status = status;
    if (password) userToUpdate.password = password;

    userToUpdate.updatedAt = new Date();
    await userToUpdate.save();

    // Return updated user
    return NextResponse.json({
      user: {
        id: userToUpdate._id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
        status: userToUpdate.status,
        updatedAt: userToUpdate.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user (accessible to everyone)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User deleted successfully",
      id: params.id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
