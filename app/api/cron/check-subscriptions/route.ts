import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// This route is designed to be called by a cron job service (like Vercel Cron)
// It checks for expired subscriptions and updates their status
export async function GET(request: NextRequest) {
  try {
    // Add a simple API key check for minimal security
    // In production, use a more robust solution
    const apiKey = request.nextUrl.searchParams.get("api_key");
    const expectedApiKey = process.env.CRON_API_KEY || "your-secret-cron-key";

    if (apiKey !== expectedApiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();

    // Get current date
    const now = new Date();

    // Find all active subscriptions that have expired
    const expiredSubscriptions = await Subscription.find({
      status: "active",
      endDate: { $lt: now },
    });

    console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);

    // Update all expired subscriptions to "expired" status
    if (expiredSubscriptions.length > 0) {
      const updateResult = await Subscription.updateMany(
        { _id: { $in: expiredSubscriptions.map((sub) => sub._id) } },
        { $set: { status: "expired" } }
      );

      console.log(
        `Updated ${updateResult.modifiedCount} subscriptions to expired status`
      );
    }

    // Optional: Send notification emails to users with soon-to-expire subscriptions
    const warningPeriodDays = 3; // Notify users 3 days before expiration
    const warningDate = new Date();
    warningDate.setDate(now.getDate() + warningPeriodDays);

    const soonToExpireSubscriptions = await Subscription.find({
      status: "active",
      endDate: {
        $gt: now,
        $lt: warningDate,
      },
    }).populate("userId", "email name"); // Get user details for email notification

    console.log(
      `Found ${soonToExpireSubscriptions.length} subscriptions expiring soon`
    );

    // Here you would integrate with your email service to send notifications
    // For example:
    // for (const subscription of soonToExpireSubscriptions) {
    //   await sendExpirationWarningEmail(subscription.userId.email, subscription);
    // }

    return NextResponse.json({
      success: true,
      expiredCount: expiredSubscriptions.length,
      warningCount: soonToExpireSubscriptions.length,
    });
  } catch (error) {
    console.error("Error checking subscriptions:", error);
    return NextResponse.json(
      {
        error: "Server error checking subscriptions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
