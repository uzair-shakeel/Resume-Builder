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

    // For fallback, check cookies only if there's no active database subscription
    if (!hasActiveSubscription) {
      const cookieStore = cookies();
      const subscriptionCookie = cookieStore.get("hasActiveSubscription");
      const planCookie = cookieStore.get("subscriptionPlan");
      const emailCookie = cookieStore.get("subscriptionEmail");

      if (subscriptionCookie?.value === "true") {
        console.log("Active subscription found in cookies");

        // Return cookie-based subscription info
        return NextResponse.json({
          hasActiveSubscription: true,
          source: "cookie",
          plan: planCookie?.value || "trial",
          email: emailCookie?.value || userEmail,
          expiresAt: null, // We don't know exact expiry from cookie
          cookieBased: true,
        });
      }
    }

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

      // Also update cookies for backward compatibility
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

    console.log("No active subscription found");
    return NextResponse.json({
      hasActiveSubscription: false,
      message: "No active subscription found",
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);

    // If database check fails, fallback to cookies
    try {
      const cookieStore = cookies();
      const subscriptionCookie = cookieStore.get("hasActiveSubscription");

      if (subscriptionCookie?.value === "true") {
        console.log("Database check failed, falling back to cookies");
        const planCookie = cookieStore.get("subscriptionPlan");
        const emailCookie = cookieStore.get("subscriptionEmail");

        return NextResponse.json({
          hasActiveSubscription: true,
          source: "cookie_fallback",
          plan: planCookie?.value || "trial",
          email: emailCookie?.value || "unknown",
          expiresAt: null,
          errorFallback: true,
        });
      }
    } catch (cookieError) {
      console.error("Cookie fallback also failed:", cookieError);
    }

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
