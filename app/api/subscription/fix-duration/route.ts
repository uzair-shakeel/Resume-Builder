import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export async function POST(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "No authenticated user found",
        },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User email not found in session",
        },
        { status: 400 }
      );
    }

    // Find the user's active subscription
    const currentDate = new Date();
    const subscription = await Subscription.findOne({
      $or: [{ userId: session.user.id }, { email: userEmail }],
      status: "active",
      endDate: { $gt: currentDate },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          message: "No active subscription found",
        },
        { status: 404 }
      );
    }

    // Calculate the correct duration based on the plan
    let correctDuration = 30; // default
    switch (subscription.plan) {
      case "monthly":
        correctDuration = 30;
        break;
      case "quarterly":
        correctDuration = 90;
        break;
      case "yearly":
        correctDuration = 365;
        break;
    }

    // Calculate the correct end date
    const startDate = new Date(subscription.startDate);
    const correctEndDate = new Date(startDate);
    correctEndDate.setDate(startDate.getDate() + correctDuration);

    // Update the subscription with the correct end date
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscription._id,
      {
        endDate: correctEndDate,
        duration: correctDuration,
      },
      { new: true }
    );

    console.log(
      `Fixed subscription duration for ${userEmail}: ${subscription.plan} plan now has ${correctDuration} days`
    );

    return NextResponse.json({
      success: true,
      message: "Subscription duration fixed successfully",
      data: {
        plan: subscription.plan,
        oldEndDate: subscription.endDate,
        newEndDate: correctEndDate,
        duration: correctDuration,
      },
    });
  } catch (error) {
    console.error("Error fixing subscription duration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fixing subscription duration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
