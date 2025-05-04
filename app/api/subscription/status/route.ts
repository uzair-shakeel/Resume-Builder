import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Get the user ID from a session/token
    // 2. Query your database to check if the user has an active subscription
    // 3. Return the subscription status with complete details

    // For demo purposes, we'll check cookies
    const cookieStore = cookies();
    const subscriptionCookie = cookieStore.get("hasActiveSubscription");
    const planCookie = cookieStore.get("subscriptionPlan");
    const emailCookie = cookieStore.get("subscriptionEmail");

    const hasActiveSubscription = subscriptionCookie?.value === "true";

    // Calculate expiry date (14 days from now, or use the actual expiry if stored)
    const expiresAt = hasActiveSubscription
      ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    return NextResponse.json({
      hasActiveSubscription,
      plan: planCookie?.value || null,
      email: emailCookie?.value || null,
      expiresAt,
      // In a real app you would include additional details like:
      // - Billing information
      // - Payment history
      // - Next billing date
      // - Cancellation options
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);

    return NextResponse.json(
      {
        hasActiveSubscription: false,
        error: "Failed to check subscription status",
      },
      { status: 500 }
    );
  }
}
