import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Plan prices in cents
const PLAN_PRICES = {
  monthly: 99, // Trial price in cents (0.99)
  quarterly: 99, // Trial price in cents (0.99)
  yearly: 99, // Trial price in cents (0.99)
};

export async function POST(request: NextRequest) {
  try {
    console.log("Subscription registration request received");

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { reference, email, plan, type, amount, duration, userId, name } =
      body;

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
      `Registering subscription for ${email}, plan: ${plan}, type: ${type}, duration: ${
        duration || "default"
      } days`
    );

    // Connect to the database
    await connectToDatabase();

    // Get the current user from the session
    const session = await getServerSession(authOptions);

    // Find user by email or userId
    let user = null;

    // Try to find by userId if provided
    if (userId) {
      user = await User.findById(userId);
    }

    // If not found by userId, try by email
    if (!user) {
      user = await User.findOne({ email });
    }

    // Try session email as fallback
    if (!user && session?.user?.email) {
      user = await User.findOne({ email: session.user.email });
    }

    // Create user if not found
    if (!user) {
      console.log(`User not found for ${email}, creating new user record`);
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        role: "user",
      });
      console.log(`Created new user with ID: ${user._id}`);
    }

    // Calculate subscription end date based on the plan
    const startDate = new Date();
    const endDate = new Date();

    // Use the provided duration or fall back to defaults
    let planDuration = 14; // Default to 14 days

    if (duration) {
      planDuration = duration;
    } else if (plan === "monthly") {
      planDuration = 30;
    } else if (plan === "quarterly") {
      planDuration = 90;
    } else if (plan === "yearly") {
      planDuration = 365;
    }

    endDate.setDate(startDate.getDate() + planDuration);

    // Determine the actual amount paid
    const actualAmount =
      amount || PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || 99;

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
      duration: planDuration,
    });

    console.log("Subscription created in database:", subscription._id);
    console.log(`Subscription valid until: ${endDate.toISOString()}`);

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
        duration: planDuration,
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
