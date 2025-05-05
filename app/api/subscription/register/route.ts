import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Subscription plan durations in days
const PLAN_DURATIONS = {
  trial: 14, // 14 days trial
  monthly: 30, // 30 days
  quarterly: 90, // 90 days
  yearly: 365, // 365 days
};

// Plan prices in XOF (or your currency)
const PLAN_PRICES = {
  trial: 99, // Trial price in cents (0.99)
  monthly: 1499, // 14.99
  quarterly: 2997, // 29.97 (9.99 x 3)
  yearly: 8988, // 89.88 (7.49 x 12)
};

export async function POST(request: NextRequest) {
  try {
    console.log("Subscription registration request received");

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { reference, email, plan, type, amount } = body;

    if (!reference || !email || !plan || !type) {
      console.error("Missing required fields:", {
        reference,
        email,
        plan,
        type,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          details: {
            reference: !!reference,
            email: !!email,
            plan: !!plan,
            type: !!type,
          },
        },
        { status: 400 }
      );
    }

    console.log(
      `Registering subscription for ${email}, plan: ${plan}, type: ${type}`
    );

    // Connect to the database
    await connectToDatabase();

    // Get the current user from the session
    const session = await getServerSession(authOptions);

    // Find user by email
    let user = await User.findOne({ email });

    if (!user && session?.user?.email) {
      // Try to find user by session email if available
      user = await User.findOne({ email: session.user.email });
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Calculate subscription end date based on the plan
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(
      startDate.getDate() + PLAN_DURATIONS[plan] || PLAN_DURATIONS.trial
    );

    // Determine the actual amount paid
    const actualAmount = amount || PLAN_PRICES[plan] || PLAN_PRICES.trial;

    // Create a new subscription in the database
    const subscription = await Subscription.create({
      userId: user._id,
      email,
      plan,
      type,
      startDate,
      endDate,
      amount: actualAmount,
      currency: "XOF", // Change as needed
      status: "active",
      paymentReference: reference,
    });

    console.log("Subscription created in database:", subscription._id);

    // We'll keep the cookies as a fallback/convenience,
    // but the database will be the source of truth
    const cookieStore = cookies();

    try {
      cookieStore.set({
        name: "hasActiveSubscription",
        value: "true",
        expires: endDate,
        path: "/",
      });

      cookieStore.set({
        name: "subscriptionPlan",
        value: plan,
        expires: endDate,
        path: "/",
      });

      cookieStore.set({
        name: "subscriptionEmail",
        value: email,
        expires: endDate,
        path: "/",
      });

      console.log("Cookies set successfully for subscription");
    } catch (cookieError) {
      console.error("Error setting cookies:", cookieError);
      // Continue even if cookies fail - database is the source of truth
    }

    console.log("Subscription registered successfully");
    return NextResponse.json({
      success: true,
      message: "Subscription registered successfully",
      data: {
        subscriptionId: subscription._id,
        reference,
        email,
        plan,
        type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error registering subscription:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error while registering subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
