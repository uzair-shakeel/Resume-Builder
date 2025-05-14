import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    // If no user found
    if (!user) {
      console.log(`Dashboard login failed: No user found with email ${email}`);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== "admin") {
      console.log(`Dashboard login failed: User ${email} is not an admin`);
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      console.log(
        `Dashboard login failed: Invalid password for admin ${email}`
      );
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`Admin authenticated successfully: ${email}`);

    // Create JWT token with admin flag
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isAdmin: true,
      },
      process.env.JWT_SECRET || "fallback_secret_dont_use_in_production",
      {
        expiresIn: "7d",
      }
    );

    // Return user info and token
    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status || "active",
        },
        token,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Dashboard login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
