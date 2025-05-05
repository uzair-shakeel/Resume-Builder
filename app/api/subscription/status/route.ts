import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("No authenticated user found in session");
      return NextResponse.json({
        hasActiveSubscription: false,
        message: "No authenticated user found",
      });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const userEmail = session.user.email;
    if (!userEmail) {
      console.log("User email not found in session");
      return NextResponse.json({
        hasActiveSubscription: false,
        message: "User email not found in session",
      });
    }

    console.log(`Checking subscription status for ${userEmail}`);

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(`User with email ${userEmail} not found in database`);
      return NextResponse.json({
        hasActiveSubscription: false,
        message: "User not found in database",
      });
    }

    // Find active subscriptions for this user
    const currentDate = new Date();
    const subscription = await Subscription.findOne({
      $or: [{ userId: user._id }, { email: userEmail }],
      status: "active",
      endDate: { $gt: currentDate }, // End date is in the future
    }).sort({ endDate: -1 }); // Get the subscription with the furthest end date

    const hasActiveSubscription = !!subscription;
    console.log(
      `Database subscription check result: ${
        hasActiveSubscription ? "Active" : "Inactive"
      }`
    );

    // Database is the source of truth - if no subscription is found, the user doesn't have one
    // We'll still update cookies for backward compatibility but won't rely on them for verification
    if (!hasActiveSubscription) {
      // Clear any existing subscription cookies for security
      const cookieStore = cookies();
      cookieStore.set("hasActiveSubscription", "false", {
        path: "/",
        maxAge: 0, // Expire immediately
        sameSite: "strict",
      });
      cookieStore.set("subscriptionPlan", "", {
        path: "/",
        maxAge: 0,
        sameSite: "strict",
      });
      cookieStore.set("subscriptionEmail", "", {
        path: "/",
        maxAge: 0,
        sameSite: "strict",
      });

      console.log("No active subscription found, cleared cookies");
      return NextResponse.json({
        hasActiveSubscription: false,
        message: "No active subscription found",
      });
    }

    if (subscription) {
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
        currency: subscription.currency || "USD",
        paymentReference: subscription.paymentReference || "",
      };

      // Calculate remaining days
      const remainingTime =
        validSubscription.endDate.getTime() - currentDate.getTime();
      const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

      console.log(
        `Returning active subscription with ${remainingDays} days remaining`
      );

      // Update cookies with correct expiration time (matches subscription end date)
      // This is only for backward compatibility but not used for verification
      const cookieStore = cookies();
      cookieStore.set("hasActiveSubscription", "true", {
        path: "/",
        expires: validSubscription.endDate,
        sameSite: "strict",
      });
      cookieStore.set("subscriptionPlan", validSubscription.plan, {
        path: "/",
        expires: validSubscription.endDate,
        sameSite: "strict",
      });
      cookieStore.set("subscriptionEmail", validSubscription.email, {
        path: "/",
        expires: validSubscription.endDate,
        sameSite: "strict",
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

    return NextResponse.json({
      hasActiveSubscription: false,
      message: "No active subscription found",
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);

    // No cookie fallback for errors - only database checks are trusted for security
    return NextResponse.json(
      {
        hasActiveSubscription: false,
        error: "Failed to check subscription status",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
