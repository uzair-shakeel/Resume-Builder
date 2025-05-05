import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

// Helper to check if user is an admin
async function isAdmin(email: string) {
  // In a real application, you'd have an admin role in your user model
  // For simplicity, we'll just check a hardcoded admin email
  // Modify this to use your actual admin checking logic
  const adminEmails = ["admin@example.com"];
  return adminEmails.includes(email);
}

// GET: List all subscriptions with filtering options
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is an admin
    const isUserAdmin = await isAdmin(session.user.email);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: "Administrator access required" },
        { status: 403 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const plan = searchParams.get("plan");
    const type = searchParams.get("type");
    const email = searchParams.get("email");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};
    if (status) query.status = status;
    if (plan) query.plan = plan;
    if (type) query.type = type;
    if (email) query.email = { $regex: email, $options: "i" };

    // Execute query with pagination
    const subscriptions = await Subscription.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Subscription.countDocuments(query);

    return NextResponse.json({
      subscriptions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Server error fetching subscriptions" },
      { status: 500 }
    );
  }
}

// POST: Update a subscription's status (extend, cancel, etc.)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is an admin
    const isUserAdmin = await isAdmin(session.user.email);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: "Administrator access required" },
        { status: 403 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Get request body
    const body = await request.json();
    const { subscriptionId, action, endDate, status } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Find subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Perform requested action
    switch (action) {
      case "extend":
        if (!endDate) {
          return NextResponse.json(
            { error: "End date is required for extension" },
            { status: 400 }
          );
        }
        subscription.endDate = new Date(endDate);
        subscription.status = "active";
        break;

      case "cancel":
        subscription.status = "canceled";
        break;

      case "activate":
        subscription.status = "active";
        break;

      case "update-status":
        if (!status) {
          return NextResponse.json(
            { error: "Status is required for status update" },
            { status: 400 }
          );
        }
        subscription.status = status;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Save changes
    await subscription.save();

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Server error updating subscription" },
      { status: 500 }
    );
  }
}
