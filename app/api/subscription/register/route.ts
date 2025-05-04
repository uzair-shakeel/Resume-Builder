import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// In production, this would interact with a database
export async function POST(request: NextRequest) {
  try {
    console.log("Subscription registration request received");

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { reference, email, plan, type } = body;

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

    // In a real application, you would:
    // 1. Store subscription details in a database
    // 2. Set up a webhook to handle subscription renewal
    // 3. Potentially integrate with a CRM system

    // For now, we'll just set a cookie to indicate an active subscription
    const cookieStore = cookies();

    // Set a subscription cookie that expires in 14 days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);

    try {
      cookieStore.set({
        name: "hasActiveSubscription",
        value: "true",
        expires: expirationDate,
        path: "/",
      });

      cookieStore.set({
        name: "subscriptionPlan",
        value: plan,
        expires: expirationDate,
        path: "/",
      });

      cookieStore.set({
        name: "subscriptionEmail",
        value: email,
        expires: expirationDate,
        path: "/",
      });

      console.log("Cookies set successfully for subscription");
    } catch (cookieError) {
      console.error("Error setting cookies:", cookieError);
      // Continue even if cookies fail - we'll still return success
    }

    console.log("Subscription registered successfully");
    return NextResponse.json({
      success: true,
      message: "Subscription registered successfully",
      data: {
        reference,
        email,
        plan,
        expiresAt: expirationDate.toISOString(),
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
