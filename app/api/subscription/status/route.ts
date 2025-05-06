import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    console.log("Subscription status check requested");

    // Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("Subscription status: No authenticated user found");
      return NextResponse.json(
        {
          hasActiveSubscription: false,
          message: "No authenticated user found",
          error: "UNAUTHENTICATED",
        },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const userEmail = session.user.email;
    if (!userEmail) {
      console.log("Subscription status: User email not found in session");
      return NextResponse.json(
        {
          hasActiveSubscription: false,
          message: "User email not found in session",
          error: "MISSING_EMAIL",
        },
        { status: 400 }
      );
    }

    console.log(`Checking subscription status for ${userEmail}`);

    // Find user in database
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(`User with email ${userEmail} not found in database`);
      return NextResponse.json(
        {
          hasActiveSubscription: false,
          message: "User not found in database",
          error: "USER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Find active subscriptions for this user by user ID or email
    const currentDate = new Date();

    // Build a comprehensive query
    const query = {
      $or: [{ userId: user._id.toString() }, { email: userEmail }],
      status: "active",
      endDate: { $gt: currentDate }, // End date is in the future
    };

    console.log("Subscription query:", JSON.stringify(query));

    const subscription = await Subscription.findOne(query).sort({
      endDate: -1,
    }); // Get the subscription with the furthest end date

    // Check if user has an active subscription
    const hasActiveSubscription = !!subscription;

    console.log(
      `Database subscription check result: ${
        hasActiveSubscription ? "ACTIVE" : "INACTIVE"
      }`
    );

    if (hasActiveSubscription && subscription) {
      // Data validation for subscription object
      const validSubscription = {
        _id: subscription._id?.toString() || "unknown",
        plan: subscription.plan || "unknown",
        type: subscription.type || "all",
        email: subscription.email || userEmail,
        startDate: subscription.startDate || new Date(),
        endDate: subscription.endDate || new Date(),
        status: subscription.status || "active",
        amount: subscription.amount || 0,
        currency: subscription.currency || "XOF",
        paymentReference: subscription.paymentReference || "",
      };

      // Calculate remaining days
      const remainingTime =
        validSubscription.endDate.getTime() - currentDate.getTime();
      const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

      console.log(
        `Returning active subscription with ${remainingDays} days remaining`
      );

      // Update cookies for backward compatibility
      const cookieStore = cookies();
      cookieStore.set("hasActiveSubscription", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });
      cookieStore.set("subscriptionPlan", validSubscription.plan, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
      cookieStore.set("subscriptionEmail", validSubscription.email, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });

      return NextResponse.json({
        hasActiveSubscription: true,
        source: "database",
        subscriptionId: validSubscription._id,
        plan: validSubscription.plan,
        type: validSubscription.type,
        email: validSubscription.email,
        startDate: validSubscription.startDate,
        endDate: validSubscription.endDate,
        expiresAt: validSubscription.endDate.toISOString(),
        remainingDays,
        status: validSubscription.status,
        // Additional subscription details
        amount: validSubscription.amount,
        currency: validSubscription.currency,
        paymentReference: validSubscription.paymentReference,
      });
    }

    console.log("No active subscription found in database");

    // No active subscription found
    return NextResponse.json({
      hasActiveSubscription: false,
      message: "No active subscription found",
      error: "NO_SUBSCRIPTION",
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);

    return NextResponse.json(
      {
        hasActiveSubscription: false,
        error: "SERVER_ERROR",
        message: "Failed to check subscription status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
