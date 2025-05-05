import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

/**
 * Dedicated API for verifying download eligibility
 * This performs a comprehensive check to ensure:
 * 1. The user is authenticated
 * 2. The user exists in the database
 * 3. The user has an active subscription
 * 4. The subscription is not expired
 * 5. The subscription is for the right type of content
 */
export async function POST(request: NextRequest) {
  try {
    console.log("Download verification request received");

    // Extract request body
    const body = await request.json();
    const { downloadType } = body;

    if (!downloadType) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing download type parameter",
        },
        { status: 400 }
      );
    }

    // Step 1: Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("Download verification failed: No authenticated user found");
      return NextResponse.json(
        {
          success: false,
          hasActiveSubscription: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Step 2: Connect to database
    await connectToDatabase();

    // Step 3: Find the user by email
    const userEmail = session.user.email;
    if (!userEmail) {
      console.log(
        "Download verification failed: User email not found in session"
      );
      return NextResponse.json(
        {
          success: false,
          hasActiveSubscription: false,
          message: "User email not found in session",
        },
        { status: 400 }
      );
    }

    console.log(
      `Verifying download eligibility for ${userEmail}, type: ${downloadType}`
    );

    // Step 4: Find the user in the database
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(
        `Download verification failed: User with email ${userEmail} not found in database`
      );
      return NextResponse.json(
        {
          success: false,
          hasActiveSubscription: false,
          message: "User not found in database",
        },
        { status: 404 }
      );
    }

    // Step 5: Find active subscriptions for this user
    const currentDate = new Date();

    // Build a query that:
    // 1. Matches the user by ID or email
    // 2. Matches the correct subscription type
    // 3. Is active and not expired
    const query = {
      // User identification (user ID or email)
      $or: [{ userId: user._id }, { email: userEmail }],
      // Subscription must be one of these types
      type: { $in: [downloadType, "all"] },
      // Must be active and not expired
      status: "active",
      endDate: { $gt: currentDate },
    };

    // Execute the query and sort by end date
    let subscription = await Subscription.findOne(query).sort({ endDate: -1 });

    const hasActiveSubscription = !!subscription;

    if (!hasActiveSubscription) {
      console.log(
        `Download verification failed: No active subscription found for ${downloadType}`
      );
      return NextResponse.json({
        success: false,
        hasActiveSubscription: false,
        message: "No active subscription found for this content type",
      });
    }

    // If we get here, the user has an active subscription for the requested content
    console.log(
      `Download verification successful for user ${userEmail}, subscription ID: ${subscription._id}`
    );

    // Calculate remaining days for information purposes
    const endDate = subscription.endDate || new Date();
    const remainingTime = endDate.getTime() - currentDate.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      hasActiveSubscription: true,
      message: "Download verification successful",
      subscriptionDetails: {
        plan: subscription.plan,
        type: subscription.type,
        remainingDays,
        expiresAt: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error verifying download eligibility:", error);

    return NextResponse.json(
      {
        success: false,
        hasActiveSubscription: false,
        message: "Server error during download verification",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
